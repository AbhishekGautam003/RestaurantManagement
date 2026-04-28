// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date and time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get initials from name
export const getInitials = (name) => {
  return name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';
};

// Check if user has permission
export const hasPermission = (user, requiredRole) => {
  const roleHierarchy = {
    admin: 3,
    staff: 2,
    customer: 1,
  };
  
  return roleHierarchy[user?.role] >= roleHierarchy[requiredRole];
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone
export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ''));
};

// Generate URL-safe slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Truncate text
export const truncateText = (text, length = 50) => {
  return text?.length > length ? text.substring(0, length) + '...' : text;
};

// Sort array by property
export const sortByProperty = (array, property, ascending = true) => {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
};

// Filter array by multiple properties
export const filterByProperties = (array, filters) => {
  return array.filter((item) =>
    Object.entries(filters).every(([key, value]) =>
      value === '' || item[key]?.toString().toLowerCase().includes(value.toLowerCase())
    )
  );
};
