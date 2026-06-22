export const users = [
  { id: 'u1', name: 'Rahim Ahmed', email: 'rahim@gmail.com', bloodGroup: 'A+', role: 'admin', status: 'active', createdAt: '25 May, 2024' },
  { id: 'u2', name: 'Sadia Islam', email: 'sadia@gmail.com', bloodGroup: 'O+', role: 'volunteer', status: 'active', createdAt: '25 May, 2024' },
  { id: 'u3', name: 'Tanvir Hasan', email: 'tanvir@gmail.com', bloodGroup: 'B+', role: 'donor', status: 'active', createdAt: '25 May, 2024' },
  { id: 'u4', name: 'Hasan Mahmud', email: 'hasan@gmail.com', bloodGroup: 'AB-', role: 'donor', status: 'blocked', createdAt: '24 May, 2024' },
  { id: 'u5', name: 'Nusrat Jahan', email: 'nusrat@gmail.com', bloodGroup: 'AB+', role: 'volunteer', status: 'active', createdAt: '24 May, 2024' },
  { id: 'u6', name: 'Fatima Khan', email: 'fatima@gmail.com', bloodGroup: 'O-', role: 'donor', status: 'active', createdAt: '23 May, 2024' },
  { id: 'u7', name: 'Mohammad Ali', email: 'ali@gmail.com', bloodGroup: 'A-', role: 'donor', status: 'active', createdAt: '23 May, 2024' },
  { id: 'u8', name: 'Jasmine Begum', email: 'jasmine@gmail.com', bloodGroup: 'B-', role: 'volunteer', status: 'active', createdAt: '22 May, 2024' },
  { id: 'u9', name: 'Rahman Khan', email: 'rahman@gmail.com', bloodGroup: 'A+', role: 'donor', status: 'blocked', createdAt: '22 May, 2024' },
  { id: 'u10', name: 'Sophia Ahmed', email: 'sophia@gmail.com', bloodGroup: 'O+', role: 'donor', status: 'active', createdAt: '21 May, 2024' },
  { id: 'u11', name: 'Karim Hassan', email: 'karim@gmail.com', bloodGroup: 'B+', role: 'donor', status: 'active', createdAt: '21 May, 2024' },
  { id: 'u12', name: 'Layla Omar', email: 'layla@gmail.com', bloodGroup: 'AB+', role: 'volunteer', status: 'active', createdAt: '20 May, 2024' },
];

export const requests = [
  { id: 'r1', recipientName: 'Rahim Ahmed', bloodGroup: 'A+', district: 'Dhaka', upazila: 'Dhanmondi', donationDate: '2026-06-20', donationTime: '10:00', status: 'pending', donor: null },
  { id: 'r2', recipientName: 'Sadia Islam', bloodGroup: 'O+', district: 'Chattogram', upazila: 'Pahartali', donationDate: '2026-06-21', donationTime: '11:30', status: 'inprogress', donor: { name: 'Tanvir Hasan', email: 'tanvir@example.com' } },
  { id: 'r3', recipientName: 'Hasan Mahmud', bloodGroup: 'B+', district: 'Khulna', upazila: 'Bagerhat', donationDate: '2026-06-22', donationTime: '14:00', status: 'done', donor: null },
  { id: 'r4', recipientName: 'Nusrat Jahan', bloodGroup: 'AB-', district: 'Rajshahi', upazila: 'Boalia', donationDate: '2026-06-23', donationTime: '09:45', status: 'cancelled', donor: null },
  { id: 'r5', recipientName: 'Tasnim Zaman', bloodGroup: 'A-', district: 'Sylhet', upazila: 'Zakiganj', donationDate: '2026-06-24', donationTime: '15:30', status: 'pending', donor: null },
  { id: 'r6', recipientName: 'Rakib Hossain', bloodGroup: 'AB+', district: 'Barishal', upazila: 'Bauphal', donationDate: '2026-06-25', donationTime: '10:15', status: 'done', donor: { name: 'Jahidul Islam', email: 'jahid@example.com' } },
  { id: 'r7', recipientName: 'Sumaiya Khatun', bloodGroup: 'O-', district: 'Rangpur', upazila: 'Mithapukur', donationDate: '2026-06-26', donationTime: '13:00', status: 'inprogress', donor: { name: 'Fatema Begum', email: 'fatema@example.com' } },
  { id: 'r8', recipientName: 'Munna Khan', bloodGroup: 'B-', district: 'Mymensingh', upazila: 'Fulbaria', donationDate: '2026-06-27', donationTime: '16:45', status: 'done', donor: { name: 'Rakibul Haque', email: 'rakib@example.com' } },
];

export const funding = [
  { id: 'f1', donorName: 'Rahim Ahmed', email: 'rahim@example.com', amount: 50, tx: 'txn_12345', date: '2024-05-25' },
  { id: 'f2', donorName: 'Sadia Islam', email: 'sadia@example.com', amount: 20, tx: 'txn_98765', date: '2024-05-10' }
];
