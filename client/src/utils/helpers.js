export const requireAuth = (navigate, isAuthenticated) => {
  if (!isAuthenticated) {
    navigate("/login", { state: { from: window.location.pathname } });
    return false;
  }

  return true;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

export const generatePlaceholderImage = (text, width = 300, height = 300) => {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/${width}x${height}/4ade80/ffffff?text=${encodedText}`;
};
