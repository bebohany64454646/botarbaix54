console.log("🟢 بدء تشغيل البوت...");

const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'arabix.aternos.me',
    username: 'bot00', // ✅ اسم البوت بعد التعديل
    auth: 'offline',
    version: false
  });

  const swears = [
    'احا', 'يلعن', 'كلب', 'غبي', 'fuck', 'shit', 'bitch', 'damn',
    'حمار', 'وسخ', 'زفت', 'منيك', 'انيك', 'قذر', 'شرموط',
    'كس', 'كسمك', 'ابن الكلب', 'حيوان', 'nigga', 'bastard',
    'crap', 'whore', 'تفوو', 'ابن الوسخة', 'سافل', 'شرموطة', 'وسخان'
  ];

  const greetings = {
    'هاي': '🌟 أهلًا وسهلًا بك!',
    'هلا': '✨ نور السيرفر بوجودك!',
    'هلا والله': '👋 ياهلا فيك!',
    'مرحبا': '😄 مرحبًا بك في عالمنا!',
    'سلام': '☀️ السلام عليك ورحمة الله!',
    'باي': '👋 مع السلامة ونراك قريبًا!',
    'ياهلا': '💫 نورتنا والله!',
    'الف مبروك': '🎉 ألف مبروك لك! 🎊',
    'باك': '🎉 مرحبًا بعودتك!',
    'رجعت': '🤗 رجعت وعزتنا زادت!',
    'hi': '👋 Hello and welcome!',
    'hey': '🖐️ Hey there!',
    'gg': '🔥 Good game!',
    'lol': '😂 ضحكتني والله'
  };

  const warnings = {};
  const muted = new Set();
  const afkPlayers = new Set();

  let movingForward = true;
  let moveTicks = 0;
  const moveLimit = 5;

  bot.once('spawn', () => {
    console.log("✅ البوت دخل السيرفر وجاهز ✅");

    setInterval(() => {
      bot.setControlState('forward', movingForward);
      bot.setControlState('back', !movingForward);

      moveTicks++;
      if (moveTicks >= moveLimit) {
        moveTicks = 0;
        movingForward = !movingForward;
      }
    }, 500);
  });

  setInterval(() => {
    bot.chat('📢 استخدم /help لعرض أوامر البوت والتفاعل معه! 🚀');
  }, 10 * 60 * 1000);

  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      bot.chat(`🎉 أهلًا وسهلًا @${player.username}! نتمنى لك وقتًا ممتعًا في سيرفرنا 💎`);
    }
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const msg = message.toLowerCase();

    if (muted.has(username)) return;

    if (swears.some(word => msg.includes(word))) {
      warnings[username] = (warnings[username] || 0) + 1;

      if (warnings[username] >= 3) {
        muted.add(username);
        bot.chat(`⛔ @${username} تم كتمك بعد تكرار الألفاظ المسيئة.`);
      } else {
        const remaining = 3 - warnings[username];
        bot.chat(`⚠️ @${username} الرجاء عدم استخدام ألفاظ مسيئة. (${remaining} تحذير متبقٍ قبل الميوت)`);
      }
      return;
    }

    for (const key in greetings) {
      if (msg.includes(key)) {
        bot.chat(`💬 @${username} ${greetings[key]}`);
        return;
      }
    }

    if (msg.startsWith('/unmute')) {
      const parts = msg.split(' ');
      const target = parts[1];
      if (target && muted.has(target)) {
        muted.delete(target);
        warnings[target] = 0;
        bot.chat(`✅ تم فك الميوت عن @${target}`);
      } else {
        bot.chat('⚠️ لم يتم العثور على هذا اللاعب أو ليس ميوت.');
      }
      return;
    }

    if (msg === '/help') {
      bot.chat(`📜 أوامر البوت:
  /help - عرض هذه القائمة
  /unmute [اسم] - فك كتم لاعب
  /معلوماتي - عدد تحذيراتك
  تحيات مثل: hi, هاي، gg، سلام...
  ممنوع الشتائم تمامًا`);
      return;
    }

    if (msg === '/معلوماتي') {
      const warns = warnings[username] || 0;
      bot.chat(`📛 @${username} عدد تحذيراتك: ${warns}/3`);
      return;
    }

    if (msg === 'afk') {
      if (!afkPlayers.has(username)) {
        afkPlayers.add(username);
        bot.chat(`💤 @${username} أصبح AFK`);
      }
      return;
    }

    if (afkPlayers.has(username)) {
      afkPlayers.delete(username);
      bot.chat(`💡 @${username} لم يعد AFK`);
    }
  });

  bot.on('error', err => {
    console.log("💥 خطأ:", err.message);
  });

  bot.on('end', () => {
    console.log("🔁 تم فصل البوت.. إعادة المحاولة بعد 5 ثوانٍ");
    setTimeout(createBot, 5000);
  });
}

createBot();
