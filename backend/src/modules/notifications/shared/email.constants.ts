export const EMAIL_SUBJECTS = {
  restaurant: {
    registrationReceived: "Restaurant Registration Received",
    approved: "Restaurant Approved",
    rejected: "Restaurant Registration Update",
  },

  reservation: {
    submitted: "Reservation Received",
    confirmed: "Reservation Confirmed",
    cancelled: "Reservation Cancelled",
    newRequest: "New Reservation Request",
  },

  order: {
    placed: "Order Confirmation",
    preparing: "Order Being Prepared",
    ready: "Order Ready",
    delivered: "Order Delivered",
    cancelled: "Order Cancelled",
  },

  auth: {
    passwordResetOtp: "Food Spot Password Reset Code",
    passwordChanged: "Food Spot Password Changed",
  },
} as const;