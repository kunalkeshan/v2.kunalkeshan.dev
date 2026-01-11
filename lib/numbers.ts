/**
 * Currency and number formatting utilities
 */

/**
 * Formats a price as currency in INR using Indian locale
 * Automatically includes the rupee symbol (₹) and proper formatting
 * 
 * @param price - The price to format (number)
 * @returns Formatted currency string (e.g., "₹100.00")
 * 
 * @example
 * formatCurrency(100) // Returns "₹100.00"
 * formatCurrency(1234.56) // Returns "₹1,234.56"
 */
export function formatCurrency(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
}
