const mockDonationRequests = [
  {
    _id: "mock-req-001",
    recipientName: "Rafi Ahmed",
    district: "Dhaka",
    upazila: "Dhanmondi",
    hospitalName: "Evercare Hospital",
    bloodGroup: "A+",
    donationDate: "2026-06-25T00:00:00.000Z",
    donationTime: "10:00 AM",
    requestMessage: "Need blood for emergency surgery.",
    status: "inprogress",
    requester: {
      name: "Rafi Ahmed",
      avatar: "https://i.pravatar.cc/100?img=12",
      email: "rafi.ahmed@example.com"
    },
    donor: {
      name: "Abir Hasan",
      avatar: "https://i.pravatar.cc/100?img=15",
      email: "abir.hasan@example.com"
    }
  },
  {
    _id: "mock-req-002",
    recipientName: "Mariam Hasan",
    district: "Chattogram",
    upazila: "Agrabad",
    hospitalName: "Chattogram Medical",
    bloodGroup: "O+",
    donationDate: "2026-06-26T00:00:00.000Z",
    donationTime: "02:00 PM",
    requestMessage: "Urgent requirement for dengue patient.",
    status: "pending",
    requester: {
      name: "Mariam Hasan",
      avatar: "https://i.pravatar.cc/100?img=5",
      email: "mariam.hasan@example.com"
    },
    donor: null
  },
  {
    _id: "mock-req-003",
    recipientName: "Rakibul Islam",
    district: "Sylhet",
    upazila: "Zindabazar",
    hospitalName: "Sylhet MAG Osmani",
    bloodGroup: "B+",
    donationDate: "2026-06-27T00:00:00.000Z",
    donationTime: "11:00 AM",
    requestMessage: "Father needs blood after operation.",
    status: "done",
    requester: {
      name: "Rakibul Islam",
      avatar: "https://i.pravatar.cc/100?img=22",
      email: "rakibul@example.com"
    },
    donor: {
      name: "Samiul Karim",
      avatar: "https://i.pravatar.cc/100?img=23",
      email: "samiul@example.com"
    }
  },
  {
    _id: "mock-req-004",
    recipientName: "Nusrat Jahan",
    district: "Khulna",
    upazila: "Sonadanga",
    hospitalName: "Khulna City Medical",
    bloodGroup: "AB+",
    donationDate: "2026-06-28T00:00:00.000Z",
    donationTime: "09:30 AM",
    requestMessage: "Need 2 bags for delivery case.",
    status: "pending",
    requester: {
      name: "Nusrat Jahan",
      avatar: "https://i.pravatar.cc/100?img=35",
      email: "nusrat@example.com"
    },
    donor: null
  },
  {
    _id: "mock-req-005",
    recipientName: "Tanvir Rahman",
    district: "Rajshahi",
    upazila: "Boalia",
    hospitalName: "Rajshahi Medical",
    bloodGroup: "A-",
    donationDate: "2026-06-29T00:00:00.000Z",
    donationTime: "04:15 PM",
    requestMessage: "Need blood for accident patient.",
    status: "cancelled",
    requester: {
      name: "Tanvir Rahman",
      avatar: "https://i.pravatar.cc/100?img=41",
      email: "tanvir@example.com"
    },
    donor: null
  },
  {
    _id: "mock-req-006",
    recipientName: "Sharmeen Akter",
    district: "Barishal",
    upazila: "Sadar",
    hospitalName: "Sher-e-Bangla Medical",
    bloodGroup: "O-",
    donationDate: "2026-06-30T00:00:00.000Z",
    donationTime: "08:45 AM",
    requestMessage: "Rare blood group needed urgently.",
    status: "inprogress",
    requester: {
      name: "Sharmeen Akter",
      avatar: "https://i.pravatar.cc/100?img=47",
      email: "sharmeen@example.com"
    },
    donor: {
      name: "Nafiz Ahmed",
      avatar: "https://i.pravatar.cc/100?img=11",
      email: "nafiz@example.com"
    }
  },
  {
    _id: "mock-req-007",
    recipientName: "Saif Uddin",
    district: "Rangpur",
    upazila: "Pirgacha",
    hospitalName: "Rangpur General",
    bloodGroup: "B-",
    donationDate: "2026-07-01T00:00:00.000Z",
    donationTime: "12:30 PM",
    requestMessage: "Need blood for kidney patient.",
    status: "pending",
    requester: {
      name: "Saif Uddin",
      avatar: "https://i.pravatar.cc/100?img=53",
      email: "saif@example.com"
    },
    donor: null
  },
  {
    _id: "mock-req-008",
    recipientName: "Farzana Islam",
    district: "Mymensingh",
    upazila: "Trishal",
    hospitalName: "Mymensingh Medical",
    bloodGroup: "AB-",
    donationDate: "2026-07-02T00:00:00.000Z",
    donationTime: "05:00 PM",
    requestMessage: "Need blood for cancer patient.",
    status: "done",
    requester: {
      name: "Farzana Islam",
      avatar: "https://i.pravatar.cc/100?img=26",
      email: "farzana@example.com"
    },
    donor: {
      name: "Rimon Das",
      avatar: "https://i.pravatar.cc/100?img=30",
      email: "rimon@example.com"
    }
  },
  {
    _id: "mock-req-009",
    recipientName: "Imran Hossain",
    district: "Cumilla",
    upazila: "Kotbari",
    hospitalName: "Cumilla Trauma Center",
    bloodGroup: "A+",
    donationDate: "2026-07-03T00:00:00.000Z",
    donationTime: "07:00 AM",
    requestMessage: "Need blood post operation.",
    status: "pending",
    requester: {
      name: "Imran Hossain",
      avatar: "https://i.pravatar.cc/100?img=19",
      email: "imran@example.com"
    },
    donor: null
  },
  {
    _id: "mock-req-010",
    recipientName: "Sadia Noor",
    district: "Gazipur",
    upazila: "Tongi",
    hospitalName: "Gazipur City Hospital",
    bloodGroup: "O+",
    donationDate: "2026-07-04T00:00:00.000Z",
    donationTime: "03:10 PM",
    requestMessage: "Blood needed for thalassemia patient.",
    status: "inprogress",
    requester: {
      name: "Sadia Noor",
      avatar: "https://i.pravatar.cc/100?img=37",
      email: "sadia@example.com"
    },
    donor: {
      name: "Masud Rana",
      avatar: "https://i.pravatar.cc/100?img=38",
      email: "masud@example.com"
    }
  },
  {
    _id: "mock-req-011",
    recipientName: "Jahidul Alam",
    district: "Narsingdi",
    upazila: "Belabo",
    hospitalName: "Narsingdi Sadar",
    bloodGroup: "B+",
    donationDate: "2026-07-05T00:00:00.000Z",
    donationTime: "01:25 PM",
    requestMessage: "Need 1 bag blood for child.",
    status: "pending",
    requester: {
      name: "Jahidul Alam",
      avatar: "https://i.pravatar.cc/100?img=9",
      email: "jahid@example.com"
    },
    donor: null
  },
  {
    _id: "mock-req-012",
    recipientName: "Priyanka Sen",
    district: "Narayanganj",
    upazila: "Fatullah",
    hospitalName: "Narayanganj General",
    bloodGroup: "O-",
    donationDate: "2026-07-06T00:00:00.000Z",
    donationTime: "06:40 PM",
    requestMessage: "Urgent blood requirement in ICU.",
    status: "done",
    requester: {
      name: "Priyanka Sen",
      avatar: "https://i.pravatar.cc/100?img=16",
      email: "priyanka@example.com"
    },
    donor: {
      name: "Towhid Khan",
      avatar: "https://i.pravatar.cc/100?img=3",
      email: "towhid@example.com"
    }
  }
];

export default mockDonationRequests;
