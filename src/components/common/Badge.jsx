export function Badge({
  children,
  variant = 'sky',
  icon: Icon,
  className = '',
  onClick,
}) {
  const variantClass = `badge-${variant}`;

  return (
    <span
      className={`badge ${variantClass} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {Icon && <Icon size={12} />}
      <span>{children}</span>
    </span>
  );
}
