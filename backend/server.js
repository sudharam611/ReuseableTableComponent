const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

const generateRandomData = () => {
    const randomNames = ["Olivia", "Liam", "Aria", "Noah", "Aditi", "Aarav", "Sofia", "Ethan", "Priya", "Kabir",
  "Emily", "Lucas", "Mia", "Isaac", "Rhea", "Vihaan", "Isabella", "Caleb", "Zara", "Dhruv",
  "Chloe", "Benjamin", "Saanvi", "Nathan", "Aryan", "Emma", "Jackson", "Leah", "Aarushi", "Elijah",
  "Lily", "Ayaan", "Ava", "Mason", "Kiran", "Sophia", "Logan", "Anaya", "Muhammad", "Gabriella",
  "Aarav", "Aaron", "Scarlett", "Dylan", "Sanjay", "Maya", "Oliver", "Tara", "Ethan", "Siddharth",
  "Ryan", "Nisha", "Victoria", "Harsha", "Amelia", "Aditya", "Penelope", "Rajan", "Hannah", "Arya",
  "Grace", "Zayan", "Harper", "Reyansh", "Charlotte", "Akshay", "Ellie", "Sahil", "Abigail", "Arnav",
  "Eleanor", "Ishan", "Mila", "Surya", "Eliana", "Aryav", "Nora", "Parth", "Hazel", "Vivaan",
  "Paisley", "Anirudh", "Stella", "Devesh", "Layla", "Rohan", "Lila", "Pranav", "Violet", "Nikhil",
  "Madison", "Aman", "Bella", "Kunal", "Iris", "Shaurya", "Freya", "Harsh", "Chloe", "Ameya",
  "Samara", "Jayant", "Evelyn", "Ritesh", "Piper", "Harini", "Aurora", "Nithin", "Lily", "Omkar",
  "Alina", "Shlok", "Sadie", "Vishal", "Clara", "Mihir", "Ruby", "Rajiv", "Daisy", "Aarush",
  "Poppy", "Keshav", "Juniper", "Adarsh", "Willow", "Bhavya", "Skylar", "Yash", "Ivy", "Krish",
  "Bella", "Samarth", "Flora", "Dhyan", "Brynn", "Aniket", "Evie", "Arhaan", "Lucia", "Harith",
  "Amara", "Kartik", "Harper", "Ayan", "Olivia", "Eshan", "Hannah", "Neil", "Zoey", "Om",
  "Clara", "Aadarsh", "Mia", "Rahul", "Isla", "Karthik", "Emma", "Devan", "Ivy", "Sahas",
  "Dahlia", "Advik", "Alice", "Sanket", "Sophie", "Vishnu", "Ellie", "Rajat", "Grace", "Soham",
  "Chloe", "Dheeraj", "Freya", "Manish", "Hazel", "Chirag", "Talia", "Arjun", "Clara", "Harshit",
  "Maisie", "Ishaan", "Layla", "Vedant", "Lilly", "Aryaman", "Flora", "Neel", "Brooklyn", "Rishi",
  "Harper", "Tejas", "Callie", "Tanmay", "Penelope", "Ravi", "Amara", "Akash", "Savannah", "Vihaan", "Sudha"];

  const flowerImages = [
    {
      id: 1,
      title: "Rose",
      alt: "Beautiful red rose",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 2,
      title: "Sunflower",
      alt: "Bright sunflower in bloom",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 3,
      title: "Tulip",
      alt: "Pink tulip in garden",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://unsplash.com/photos/pink-flower-ATgfRqpFfFI"
    },
    {
      id: 4,
      title: "Daisy",
      alt: "White daisy flower",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://unsplash.com/photos/pink-flower-ATgfRqpFfFIhttps://images.unsplash.com/photo-1549887534-24854f6a6f7e?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 5,
      title: "Lily",
      alt: "Elegant white lily",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://unsplash.com/photos/pink-flower-ATgfRqpFfFIhttps://images.unsplash.com/photo-1565120130284-d08dc1e6a55f?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 6,
      title: "Orchid",
      alt: "Purple orchid close-up",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://unsplash.com/photos/pink-flower-ATgfRqpFfFIhttps://images.unsplash.com/photo-1514327602523-4e53a8325a01?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 7,
      title: "Peony",
      alt: "Blooming peony flowers",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://unsplash.com/photos/pink-flower-ATgfRqpFfFIhttps://images.unsplash.com/photo-1587302534960-8470fe6f3ca8?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 8,
      title: "Lavender",
      alt: "Lavender field at sunset",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://unsplash.com/photos/pink-flower-ATgfRqpFfFIhttps://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 9,
      title: "Marigold",
      alt: "Orange marigold bloom",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://unsplash.com/photos/pink-flower-ATgfRqpFfFIhttps://images.unsplash.com/photo-1582197497924-18d6f71d3b1b?auto=format&fit=crop&w=100&q=80"
    },
    {
      id: 10,
      title: "Camellia",
      alt: "Camellia flower petals",
      url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=100&q=80https://unsplash.com/photos/pink-flower-ATgfRqpFfFIhttps://images.unsplash.com/photo-1514448559795-1f3e2487840d?auto=format&fit=crop&w=100&q=80"
    }
  ];
  
  
  const data = [];
  for(let i=0; i < 10000; i++) {
    data.push({
        id: i + 1,
        name: randomNames[Math.floor(Math.random() * randomNames.length)],
        age: Math.floor(Math.random() * 85) + 1,
        rank: Math.floor(Math.random() * 500) + 1,
        // present: Math.random() < 0.5,
        // address: "south mada street koyambedu",
       // image: flowerImages[Math.floor(Math.random() * flowerImages.length)],
        percentage: parseFloat((Math.random() * 100).toFixed(2))
    });
  }
  return data;
}

app.get("/data", (req, res) => {
    const data = generateRandomData();
    res.json(data);
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
})