const sequelize = require('./models/index');
const User = require('./models/User');
const ResearchPaper = require('./models/ResearchPaper');
const CommunityPost = require('./models/CommunityPost');
const Article = require('./models/Article');
const Course = require('./models/Course');
const bcrypt = require('bcrypt');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Database synced (all tables cleared)');

  const saltBuffer = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', saltBuffer);

  const users = await User.bulkCreate([
    { email: 'admin@deraya.edu.eg', password, display_name: 'Dr. Ahmed Salem', faculty: 'Pharmacy', bio: 'Senior Researcher in Pharmacology' },
    { email: 'sarah@deraya.edu.eg', password, display_name: 'Sarah Jonas', faculty: 'Business', bio: 'Business Analyst' },
    { email: 'dentist@deraya.edu.eg', password, display_name: 'Dr. Mona Ali', faculty: 'Dentistry', bio: 'Oral Health Expert' },
  ]);

  await ResearchPaper.bulkCreate([
    { title: 'Advanced Pharmacology Trends 2026', abstract: 'Deep dive into next-gen drug delivery systems.', faculty: 'Pharmacy', file_url: '#', user_id: users[0].id, pages: 45 },
    { title: 'Global Market Shifts after 2025', abstract: 'Analyzing the economic recovery patterns.', faculty: 'Business', file_url: '#', user_id: users[1].id, pages: 32 },
  ]);

  await CommunityPost.bulkCreate([
    { content: 'Excited to announce our new lab collaboration!', faculty: 'Physical Therapy', user_id: users[2].id },
    { content: 'Anyone interested in a study group for Advanced Bio-chemistry?', faculty: 'Pharmacy', user_id: users[0].id },
  ]);

  await Article.bulkCreate([
    { title: 'The Future of AI in Modern Dentistry', content: 'AI is transforming how we diagnose oral diseases...', faculty: 'Dentistry', user_id: users[2].id, read_time: 8, tags: 'AI,Dentistry,Innovation' },
    { title: 'Sustainable Business Models for Startups', content: 'Sustainability is no longer an option, it is a necessity...', faculty: 'Business', user_id: users[1].id, read_time: 12, tags: 'Sustainability,Business,Green' },
  ]);

  await Course.bulkCreate([
    { title: 'Introduction to Bio-Tech', description: 'Basics of biotechnology and its applications in Pharmacy.', faculty: 'Pharmacy', instructor: 'Dr. Ahmed Salem', level: 'Beginner', enrolled_count: 145 },
    { title: 'Advanced Financial Management', description: 'Strategic financial planning for modern enterprises.', faculty: 'Business', instructor: 'Sarah Jonas', level: 'Advanced', enrolled_count: 89, featured: true },
  ]);

  console.log('Seeding completed successfully!');
  process.exit();
}

seed();
