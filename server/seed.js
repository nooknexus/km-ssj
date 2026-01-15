const db = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        const username = 'admin';
        const password = 'admin123';
        const email = 'admin@km.health';
        const department = 'IT';
        const role = 'admin';

        // Check if exists
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length > 0) {
            console.log('Admin user already exists.');
        } else {
            const encryptedPassword = await bcrypt.hash(password, 10);

            await db.query(
                'INSERT INTO users (username, password, email, department, role) VALUES (?, ?, ?, ?, ?)',
                [username, encryptedPassword, email, department, role]
            );

            console.log('Admin user created successfully.');
            console.log('Username: admin');
            console.log('Password: admin123');
        }


        // Seed Categories
        const categories = [
            { name: 'โรคติดต่อ', image_url: 'https://images.unsplash.com/photo-1584036561566-b937510d9c5b?auto=format&fit=crop&q=80&w=800' },
            { name: 'การส่งเสริมสุขภาพ', image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800' },
            { name: 'สุขภาพจิต', image_url: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&q=80&w=800' },
            { name: 'โภชนาการ', image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800' },
            { name: 'อนามัยแม่และเด็ก', image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800' }
        ];

        console.log('Seeding categories...');
        const categoryIds = [];
        for (const cat of categories) {
            const [rows] = await db.query('SELECT id FROM categories WHERE name = ?', [cat.name]);
            if (rows.length > 0) {
                categoryIds.push(rows[0].id);
            } else {
                const [result] = await db.query('INSERT INTO categories (name, image_url) VALUES (?, ?)', [cat.name, cat.image_url]);
                categoryIds.push(result.insertId);
            }
        }

        // Seed Items
        const items = [
            { category_index: 0, title: 'รู้จักกับโรคไข้เลือดออก', content: 'ไข้เลือดออกเกิดจากยุงลาย เป็นพาหะนำโรค อาการสำคัญคือไข้สูงลอย ปวดศีรษะ ปวดเมื่อยตามตัว มีจุดเลือดออกตามตัว...', is_highlight: true },
            { category_index: 0, title: 'การป้องกัน COVID-19', content: 'สวมหน้ากากอนามัย ล้างมือบ่อยๆ และเว้นระยะห่างทางสังคม ยังคงเป็นมาตรการสำคัญในการป้องกันโรค...', is_highlight: false },
            { category_index: 1, title: 'ออกกำลังกายวันละนิด จิตแจ่มใส', content: 'การออกกำลังกายอย่างน้อยวันละ 30 นาที ช่วยให้ร่างกายแข็งแรง ลดความเครียด และนอนหลับได้ดีขึ้น...', is_highlight: true },
            { category_index: 1, title: '7 วิธีดูแลตัวเองฉบับพนักงานออฟฟิศ', content: 'เพื่อป้องกันโรคออฟฟิศซินโดรม ควรลุกเดินทุกชั่วโมง ยืดเหยียดกล้ามเนื้อ และพักสายตาจากหน้าจอคอมพิวเตอร์...', is_highlight: false },
            { category_index: 2, title: 'เทคนิคจัดการความเครียด', content: 'ความเครียดสะสมส่งผลเสียต่อสุขภาพ ลองฝึกหายใจลึกๆ นั่งสมาธิ หรือหางานอดิเรกที่ชอบทำเพื่อผ่อนคลาย...', is_highlight: true },
            { category_index: 2, title: 'สัญญาณเตือนโรคซึมเศร้า', content: 'หากรู้สึกเศร้า เบื่อหน่าย ท้อแท้ ไม่อยากทำอะไร ต่อเนื่องนานเกิน 2 สัปดาห์ ควรปรึกษาแพทย์...', is_highlight: false },
            { category_index: 3, title: 'กินอาหารให้ครบ 5 หมู่', content: 'ร่างกายต้องการสารอาหารที่หลากหลาย ทั้งโปรตีน คาร์โบไฮเดรต ไขมัน วิตามิน และเกลือแร่ ในสัดส่วนที่เหมาะสม...', is_highlight: true },
            { category_index: 3, title: 'ลดหวาน มัน เค็ม', content: 'การบริโภคน้ำตาล ไขมัน และโซเดียมมากเกินไป เป็นสาเหตุของโรคไม่ติดต่อเรื้อรัง (NCDs) เช่น เบาหวาน ความดัน...', is_highlight: false },
            { category_index: 4, title: 'การเลี้ยงลูกด้วยนมแม่', content: 'นมแม่เป็นอาหารที่ดีที่สุดสำหรับทารก มีสารภูมิคุ้มกันที่ช่วยให้ลูกแข็งแรง พัฒนาการสมวัย...', is_highlight: true },
            { category_index: 4, title: 'วัคซีนพื้นฐานสำหรับเด็ก', content: 'เด็กแรกเกิดถึง 12 ปี ควรได้รับวัคซีนตามเกณฑ์ของกระทรวงสาธารณสุข เพื่อป้องกันโรคติดต่อร้ายแรง...', is_highlight: false }
        ];

        console.log('Seeding items...');
        for (const item of items) {
            const [rows] = await db.query('SELECT id FROM items WHERE title = ?', [item.title]);
            if (rows.length === 0) {
                await db.query(
                    'INSERT INTO items (category_id, title, content, is_highlight, views) VALUES (?, ?, ?, ?, ?)',
                    [categoryIds[item.category_index], item.title, item.content, item.is_highlight, Math.floor(Math.random() * 100)]
                );
            }
        }

        console.log('Seed data inserted successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
