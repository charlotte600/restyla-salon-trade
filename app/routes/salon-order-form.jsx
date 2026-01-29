import { useState } from 'react';

const PRODUCTS = [
  { id: 'gid://shopify/ProductVariant/47262548074675', name: 'Restyla Air 2.0 Pink Units', price: 'Contact for pricing' },
  { id: 'gid://shopify/ProductVariant/47262548107443', name: 'Restyla Air 2.0 White Units', price: 'Contact for pricing' },
];

export default function SalonOrderForm() {
  const [salonName, setSalonName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleQuantityChange = (productId, qty) => {
    const quantity = Math.max(0, qty);
    if (quantity === 0) {
      const newProducts = { ...selectedProducts };
      delete newProducts[productId];
      setSelectedProducts(newProducts);
    } else {
      setSelectedProducts({ ...selectedProducts, [productId]: quantity });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const variants = Object.entries(selectedProducts).map(([variantId, quantity]) => ({
      variantId,
      quantity: parseInt(quantity),
    }));

    try {
      const response = await fetch('/api/draft-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, variants }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage('✓ Success! Check your email for the checkout link with your 50% discount applied.');
        setSalonName('');
        setContactName('');
        setEmail('');
        setSelectedProducts({});
      } else {
        setMessageType('error');
        setMessage(`✗ Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      setMessageType('error');
      setMessage('✗ Failed to submit. Please try again.');
      console.error('Form error:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalQty = Object.values(selectedProducts).reduce((sum, qty) => sum + qty, 0);

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>

      <div style={styles.header}>
        <h1 style={styles.title}>Restyla Salon Trade</h1>
        <p style={styles.subtitle}>Exclusive 50% Discount - Max 2 Units Per Order</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Salon Name</label>
          <input
            type="text"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            placeholder="Your salon name"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contact Name</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Your name"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Select Products (Max 2 Units Total)</label>
          {PRODUCTS.map((product) => (
            <div key={product.id} style={styles.productItem}>
              <div style={styles.productInfo}>
                <span style={styles.productName}>{product.name}</span>
              </div>
              <div style={styles.quantityControl}>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, (selectedProducts[product.id] || 0) - 1)}
                  style={styles.qtyBtn}
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  max="2"
                  value={selectedProducts[product.id] || 0}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                  style={styles.qtyInput}
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, (selectedProducts[product.id] || 0) + 1)}
                  disabled={totalQty >= 2}
                  style={{ ...styles.qtyBtn, opacity: totalQty >= 2 && !selectedProducts[product.id] ? 0.5 : 1 }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            borderColor: messageType === 'success' ? '#c3e6cb' : '#f5c6cb',
            color: messageType === 'success' ? '#155724' : '#721c24',
          }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || totalQty === 0}
          style={{
            ...styles.submitBtn,
            opacity: loading || totalQty === 0 ? 0.6 : 1,
            cursor: loading || totalQty === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Get 50% Discount Checkout Link'}
        </button>
      </form>

      <p style={styles.disclaimer}>
        By submitting, you agree to receive marketing emails. Your 50% salon trade discount will be automatically applied at checkout.
      </p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    padding: '3rem 1.5rem',
    fontFamily: "'Montserrat', sans-serif",
  },
  header: {
    maxWidth: '500px',
    margin: '0 auto 2rem',
    textAlign: 'center',
    borderBottom: '2px solid #ecc9cc',
    paddingBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#000',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6a6a6a',
    margin: '0',
    fontWeight: '500',
  },
  form: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  formGroup: {
    marginBottom: '2rem',
  },
  label: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#000',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    marginBottom: '0.75rem',
    borderRadius: '1rem',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#000',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: 'inherit',
  },
  qtyInput: {
    width: '50px',
    height: '32px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
  },
  message: {
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid',
    fontSize: '0.95rem',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#ecc9cc',
    border: 'none',
    borderRadius: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontFamily: 'inherit',
  },
  disclaimer: {
    maxWidth: '500px',
    margin: '2rem auto 0',
    fontSize: '0.85rem',
    color: '#6a6a6a',
    textAlign: 'center',
    fontWeight: '500',
  },
};
