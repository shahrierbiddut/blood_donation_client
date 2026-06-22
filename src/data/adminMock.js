export const users = [
  { id: 'u1', name: 'Rahim Ahmed', email: 'rahim@example.com', bloodGroup: 'A+', role: 'admin', status: 'active', createdAt: '2024-05-25' },
  { id: 'u2', name: 'Sadia Islam', email: 'sadia@example.com', bloodGroup: 'O+', role: 'donor', status: 'active', createdAt: '2024-05-24' },
  { id: 'u3', name: 'Tanvir Hasan', email: 'tanvir@example.com', bloodGroup: 'B+', role: 'volunteer', status: 'blocked', createdAt: '2024-05-24' },
  { id: 'u4', name: 'Nusrat Jahan', email: 'nusrat@example.com', bloodGroup: 'AB-', role: 'donor', status: 'active', createdAt: '2024-05-24' }
];

export const requests = [
  { id: 'r1', recipientName: 'Sadia Islam', bloodGroup: 'A+', district: 'Dhaka', upazila: 'Dhanmondi', donationDate: '2024-05-25', donationTime: '10:00', status: 'inprogress', donor: { name: 'Tanvir Hasan', email: 'tanvir@gmail.com' } },
  { id: 'r2', recipientName: 'Hasan Mahmud', bloodGroup: 'O+', district: 'Gazipur', upazila: 'Tongi', donationDate: '2024-05-26', donationTime: '11:00', status: 'pending', donor: null },
  { id: 'r3', recipientName: 'Biddut Roy', bloodGroup: 'B+', district: 'Chattogram', upazila: 'Chattogram', donationDate: '2024-05-28', donationTime: '14:00', status: 'cancelled', donor: null }
];

export const funding = [
  { id: 'f1', donorName: 'Rahim Ahmed', email: 'rahim@example.com', amount: 50, tx: 'txn_12345', date: '2024-05-25' },
  { id: 'f2', donorName: 'Sadia Islam', email: 'sadia@example.com', amount: 20, tx: 'txn_98765', date: '2024-05-10' }
];
