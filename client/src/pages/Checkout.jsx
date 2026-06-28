import CheckoutSteps from '../components/checkout/CheckoutSteps';

const Checkout = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Secure Checkout</h1>
      <CheckoutSteps />
    </div>
  );
};

export default Checkout;
