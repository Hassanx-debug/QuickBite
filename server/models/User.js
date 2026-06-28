import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Sub-schema for user delivery addresses.
 * Each user can store multiple addresses with one marked as default.
 */
const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },           // e.g. "Home", "Work"
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true } // Each address gets its own _id for easy updates/deletes
);

/**
 * User Schema
 * Stores customer and admin accounts for the QuickBite platform.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Exclude password from queries by default for security
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  phone: {
    type: String,
    trim: true,
  },
  addresses: [addressSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index on email for fast lookups during login
userSchema.index({ email: 1 });

/**
 * Pre-save hook — hash the password before persisting to the database.
 * Only runs when the password field has been modified (create or update).
 */
userSchema.pre('save', async function (next) {
  // Skip hashing if the password hasn't changed (e.g. profile update)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12); // 12 rounds — good balance of security & speed
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method — compare a plain-text password against the stored hash.
 * Used during login authentication.
 * @param {string} enteredPassword - The plain-text password from the login request
 * @returns {Promise<boolean>} True if the password matches
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
