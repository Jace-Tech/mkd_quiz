const db = require("./models");
async function executeSeeds() {
  await db.sequelize.sync({ force: true });

  //load seed files and run the function to insert
  await db.configuration.insert({ id: 1, image_id: 35 });
  await db.user.insert({ first_name: "Admin", last_name: "Admin", phone: "12345678", image: "/image/profile.png", role_id: 1, refer: "admin", status: 1 });
  await db.user.insert({ first_name: "Member", last_name: "Member", phone: "12345678", image: "/image/profile.png", role_id: 2, refer: "member", status: 1 });
  await db.setting.insert({ key: "site_name", type: 0, value: "manaknightdigital" });
  await db.setting.insert({ key: "site_logo", type: 0, value: "https://manaknightdigital.com/assets/img/logo.png" });
  await db.setting.insert({ key: "maintenance", type: 1, value: "0" });
  await db.setting.insert({ key: "version", type: 0, value: "1.0.0" });
  await db.setting.insert({ key: "copyright", type: 0, value: "Copyright © 2021 manaknightdigital. All rights reserved." });
  await db.setting.insert({ key: "license_key", type: 4, value: "4097fbd4f340955de76ca555c201b185cf9d6921d977301b05cdddeae4af54f924f0508cd0f7ca66" });
  await db.role.insert({ name: "admin" });
  await db.role.insert({ name: "member" });
  await db.credential.insert({
    email: "admin@manaknight.com",
    password: "$2a$04$tQm/w6gJNKOoiZOn0WVISe1xG7BD1ulw72UNHXsXgLObtdKjlMhZK",
    type: 0,
    verify: 1,
    role_id: 1,
    user_id: 1,
    status: 1,
  });
  await db.credential.insert({
    email: "member@manaknight.com",
    password: "$2a$04$A7JX0xG2Gwt06UKpxq/Yd.oJARP6.BpzkzjOhc67.2dkfqjJPJ0pe",
    type: 0,
    verify: 1,
    role_id: 2,
    user_id: 2,
    status: 1,
  });
  await db.email.insert({
    slug: "reset-password",
    subject: "Reset your password",
    tag: "email,reset_token,link",
    html: 'Hi {{{email}}},<br/>You have requested to reset your password. Please click the link below to reset it.<br/><a href="{{{link}}}/{{{reset_token}}}">Link</a>. <br/>Thanks,<br/> Admin',
  });
  await db.email.insert({
    slug: "register",
    subject: "Register",
    tag: "email",
    html: "Hi {{{email}}},<br/>Thanks for registering on our platform. <br/>Thanks,<br/> Admin",
  });
  await db.email.insert({
    slug: "confirm-password",
    subject: "Confirm your account",
    tag: "email,confirm_token,link",
    html: 'Hi {{{email}}},<br/>Please click the link below to confirm your account.<br/><a href="{{{link}}}/{{{confirm_token}}}">Link</a>Thanks,<br/> Admin',
  });
  await db.email.insert({ slug: "verify", subject: "Account verification", tag: "code", html: "Your verification # is {{{code}}}" });
  await db.sms.insert({ slug: "verify", tag: "code", content: "Your verification # is {{{code}}}" });
  await db.image.insert({ id: 1, url: "/image/profile.png", caption: "", user_id: 1, width: 581, height: 581, mobile_width: 348, mobile_height: 348, type: 6 });
  await db.image.insert({
    id: 2,
    url: "/frontend_images/Icons/SVG/Skin Sensitivity/Non Sensitive Skin.svg",
    caption: "",
    user_id: 1,
    width: 183,
    height: 183,
    mobile_width: 183,
    mobile_height: 183,
    type: 6,
  });
  await db.image.insert({
    id: 3,
    url: "/frontend_images/Icons/SVG/Skin Sensitivity/Moderately Sensitive.svg",
    caption: "",
    user_id: 1,
    width: 183,
    height: 183,
    mobile_width: 183,
    mobile_height: 183,
    type: 6,
  });
  await db.image.insert({
    id: 4,
    url: "/frontend_images/Icons/SVG/Skin Sensitivity/Extremely Sensitive.svg",
    caption: "",
    user_id: 1,
    width: 183,
    height: 183,
    mobile_width: 183,
    mobile_height: 183,
    type: 6,
  });
  await db.image.insert({
    id: 5,
    url: "/frontend_images/Icons/SVG/Dry_Oily Skin/Dry Skin.svg",
    caption: "",
    user_id: 1,
    width: 191,
    height: 191,
    mobile_width: 191,
    mobile_height: 191,
    type: 6,
  });
  await db.image.insert({
    id: 6,
    url: "/frontend_images/Icons/SVG/Dry_Oily Skin/Normal and Combination.svg",
    caption: "",
    user_id: 1,
    width: 191,
    height: 191,
    mobile_width: 191,
    mobile_height: 191,
    type: 6,
  });
  await db.image.insert({
    id: 7,
    url: "/frontend_images/Icons/SVG/Dry_Oily Skin/Oily.svg",
    caption: "",
    user_id: 1,
    width: 191,
    height: 191,
    mobile_width: 191,
    mobile_height: 191,
    type: 6,
  });
  await db.image.insert({
    id: 8,
    url: "/frontend_images/SkintoneGraphics/1.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 9,
    url: "/frontend_images/SkintoneGraphics/2.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 10,
    url: "/frontend_images/SkintoneGraphics/3.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 11,
    url: "/frontend_images/SkintoneGraphics/4.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 12,
    url: "/frontend_images/SkintoneGraphics/5.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 13,
    url: "/frontend_images/SkintoneGraphics/6.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 14,
    url: "/frontend_images/SkintoneGraphics/7.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 15,
    url: "/frontend_images/SkintoneGraphics/8.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 16,
    url: "/frontend_images/SkintoneGraphics/9.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 17,
    url: "/frontend_images/SkintoneGraphics/10.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 18,
    url: "/frontend_images/SkintoneGraphics/11.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 19,
    url: "/frontend_images/SkintoneGraphics/12.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 20,
    url: "/frontend_images/SkintoneGraphics/13.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 21,
    url: "/frontend_images/SkintoneGraphics/14.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 22,
    url: "/frontend_images/SkintoneGraphics/15.png",
    caption: "",
    user_id: 1,
    width: 74,
    height: 135,
    mobile_width: 74,
    mobile_height: 135,
    type: 6,
  });
  await db.image.insert({
    id: 23,
    url: "/frontend_images/Icons/SVG/Blotchiness/No Blotchiness.svg",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 24,
    url: "/frontend_images/Icons/PNG/Blotchiness/Lot's of Blotchiness.png",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 25,
    url: "/frontend_images/Icons/SVG/Face Lines/No Wrinkles.svg",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 26,
    url: "/frontend_images/Icons/SVG/Face Lines/A Few Lines.svg",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 27,
    url: "/frontend_images/Icons/SVG/Face Lines/A Few Lines Observable at all times.svg",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 28,
    url: "/frontend_images/Icons/SVG/Face Lines/Some Lines.svg",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 29,
    url: "/frontend_images/Icons/SVG/Face Lines/Lines Plus Hints of Wrinkles.svg",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 30,
    url: "/frontend_images/Icons/SVG/Face Lines/A Few Wrinkles.svg",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 31,
    url: "/frontend_images/Icons/SVG/Face Lines/Lots of Wrinkles.svg",
    caption: "",
    user_id: 1,
    width: 240,
    height: 240,
    mobile_width: 240,
    mobile_height: 240,
    type: 6,
  });
  await db.image.insert({
    id: 32,
    url: "/frontend_images/Icons/SVG/Water/1 Glass of Water.svg",
    caption: "",
    user_id: 1,
    width: 140,
    height: 190,
    mobile_width: 140,
    mobile_height: 190,
    type: 6,
  });
  await db.image.insert({
    id: 33,
    url: "/frontend_images/Icons/SVG/Water/4 Glasses of Water.svg",
    caption: "",
    user_id: 1,
    width: 140,
    height: 190,
    mobile_width: 140,
    mobile_height: 190,
    type: 6,
  });
  await db.image.insert({
    id: 34,
    url: "/frontend_images/Icons/SVG/Water/8 Glasses of Water.svg",
    caption: "",
    user_id: 1,
    width: 140,
    height: 190,
    mobile_width: 140,
    mobile_height: 190,
    type: 6,
  });
  await db.image.insert({
    id: 35,
    url: "/frontend_images/MainImage/background.jpg",
    user_id: 1,
    type: 6,
  });
  await db.rule.insert({ output_variable_name: "Age", actives: '["Camomile"]', operator: 3, compare_value: "30", action: 2 });
  await db.quiz.insert({ name: "The Basics", description: "Let’s start by getting to know you." });
  await db.quiz.insert({ name: "Your Skin", description: "Let’s learn about your skin and it’s uniqueness." });
  await db.quiz.insert({ name: "Your Environment", description: "Almost done, let’s talk environment & lifestyle." });

  await db.output_variable.insert({
    name: "Bio Age",
    priority: 0,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Age",
    priority: 70,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Gender",
    priority: 75,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Pregnancy",
    priority: 100,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Hair",
    priority: 75,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Sensitivity",
    priority: 90,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Hydration",
    priority: 100,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Breakouts",
    priority: 100,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Color",
    priority: 50,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Sun",
    priority: 95,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Hyperpigmentation",
    priority: 90,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Hypopigmentation",
    priority: 90,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Redness",
    priority: 85,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Lines",
    priority: 100,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Firmness",
    priority: 100,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Pores",
    priority: 70,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Blackheads",
    priority: 65,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Allergies",
    priority: 100,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Pollution",
    priority: 80,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Temperature",
    priority: 0,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Stress",
    priority: 40,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Diet",
    priority: 30,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Sleep",
    priority: 20,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Blue Light",
    priority: 45,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.output_variable.insert({
    name: "Oxygenation",
    priority: 40,
    ranges_response: '[{"0-33":"Your skin is not that sensetive"},{"34-66":"Your skin is somewhat sensetive"},{"67-100":"Your skin is highly sensetive"}]',
  });
  await db.question.insert({
    order: 1,
    id: 1,
    quiz_id: 1,
    target: 4,
    type: 1,
    question: "What would you like to be called?",
    save_response_into: "name",
    placeholder: "name",
  });
  await db.question.insert({
    order: 2,
    id: 2,
    quiz_id: 1,
    target: 4,
    type: 3,
    note_type: 2,
    note: "Your age plays an important role on which functional actives we may want to focus on for your skin assessment.",
    output_variable_name: "Bio Age",
    weight: 100,
    extra_output_variable: '[{"name":"Age","weight":50}]',
    question_arguments: '["name"]',
    question: " When were you born <<<name>>>?",
    save_response_into: "age",
    placeholder: "year",
  });
  await db.question.insert({
    order: 3,
    id: 3,
    quiz_id: 1,
    target: 4,
    type: 4,
    note_type: 1,
    note: "Your hormones play an important role in your skin’s health and appearance.",
    question: "What is your hormonal gender",
  });
  await db.question.insert({
    order: 4,
    id: 4,
    quiz_id: 1,
    depends_on: "3|female",
    target: 1,
    type: 4,
    note_type: 2,
    note: "Hormonal changes during pregnancy can lead to visible changes in skin appearance. It’s also very important to ensure that all actives are proven safe for this important period.",
    question: "Are you pregnant or breastfeeding?",
    output_variable_name: "Pregnancy",
    weight: 100,
  });
  await db.question.insert({
    order: 5,
    id: 5,
    quiz_id: 1,
    depends_on: "3|male",
    target: 2,
    type: 4,
    note_type: 2,
    output_variable_name: "Hair",
    weight: 100,
    note: "Presence of hair on face can have an effect on the skin beneath.",
    question: "What is your facial hair situation?",
  });
  await db.question.insert({
    order: 1,
    id: 6,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    note_type: 2,
    output_variable_name: "Sensitivity",
    weight: 100,
    note: "We’ll be more careful of which actives we add to formula for those with more sensitive skin types. It’s all about balancing effectivity, complexity and leaving you feeling your best.",
    question: "How Sensitive is your skin?",
  });
  await db.question.insert({
    order: 2,
    id: 7,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Hydration",
    weight: 70,
    question: "How would you describe your skin on an average day?",
  });
  await db.question.insert({
    order: 3,
    id: 8,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Breakouts",
    weight: 100,
    question: "How often do you have breakouts, such as an occasional pimple or frequent breakouts (such as chronic acne)?",
  });
  await db.question.insert({
    order: 4,
    id: 9,
    quiz_id: 2,
    target: 4,
    type: 5,
    note_type: 2,
    image_width: 60,
    image_height: 110,
    output_variable_name: "Color",
    weight: 100,
    extra_output_variable: '[{"name":"Sun","weight":10},{"name":"Hyperpigmentation","weight":10}]',
    note: "Different skin tones are associated with different levels of skin melanin, leading to differing reactions of skin to the effects of the sun.",
    question: "What’s your skintone without a suntan?",
  });
  await db.question.insert({
    order: 5,
    id: 10,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Sun",
    weight: 20,
    question: "How easily does your skin tan?",
  });
  await db.question.insert({
    order: 6,
    id: 11,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    note_type: 1,
    output_variable_name: "Hyperpigmentation",
    weight: 90,
    extra_output_variable: '[{"name":"Sun","weight":10}]',
    note: "This is the likelihood of skin discoloring associated with aging or after injury.",
    question: "Is your skin prone to Hyperpigmentation?",
  });
  await db.question.insert({
    order: 7,
    id: 30,
    quiz_id: 2,
    question: "Is your skin prone to Hypopigmentation?",
    note: "This is the likelihood of skin discoloring associated with aging or after injury.",
    note_type: 1,
    depends_on: "",
    slider_range: "0-100",
    output_variable_name: "Hypopigmentation",
    weight: 100,
    type: 6,
  });
  await db.question.insert({
    order: 8,
    id: 12,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Sun",
    weight: 60,
    question: "How easily does your skin burn in the sun?",
  });
  await db.question.insert({
    order: 9,
    id: 13,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Redness",
    weight: 100,
    question: "How often does your skin experience redness?",
  });
  await db.question.insert({
    order: 10,
    id: 14,
    quiz_id: 2,
    target: 4,
    type: 1,
    question: "Halfway There! Do you want to save your progress?",
    placeholder: "email",
  });
  await db.question.insert({
    order: 11,
    id: 15,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Lines",
    weight: 100,
    extra_output_variable: '[{"name":"Age","weight":30}]',
    question: "Which best describes your face?",
  });
  await db.question.insert({
    order: 12,
    id: 16,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Firmness",
    weight: 100,
    extra_output_variable: '[{"name":"Age","weight":20}]',
    question: "How firm is your skin?",
  });
  await db.question.insert({
    order: 13,
    id: 17,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Pores",
    weight: 100,
    question: "Do you have enlarged pores?",
  });
  await db.question.insert({
    order: 14,
    id: 18,
    quiz_id: 2,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Blackheads",
    weight: 100,
    question: "Do you have blackheads?",
  });
  await db.question.insert({
    order: 15,
    id: 19,
    quiz_id: 2,
    target: 4,
    type: 4,
    output_variable_name: "Allergies",
    weight: 100,
    question: "Do you have any known allergies?",
  });
  await db.question.insert({
    order: 16,
    id: 20,
    quiz_id: 2,
    depends_on: "19|yes",
    target: 4,
    type: 7,
    question: "Do you know if you have allergies to any of the following?",
    response: "We’ll make sure to leave those out",
  });
  await db.question.insert({
    order: 1,
    question: "Let’s adjust your cream to your geography. Enter your city below",
    placeholder: "city",
    id: 21,
    quiz_id: 3,
    target: 4,
    type: 8,
  });
  await db.question.insert({
    order: 2,
    id: 22,
    quiz_id: 3,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Pollution",
    weight: 33,
    question: "How often do you smoke?",
  });
  await db.question.insert({
    order: 3,
    id: 23,
    quiz_id: 3,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Stress",
    weight: 100,
    question: "How would you describe your stress levels?",
  });
  await db.question.insert({
    order: 4,
    id: 24,
    quiz_id: 3,
    target: 4,
    type: 4,
    output_variable_name: "Diet",
    weight: 100,
    question: "Which of these closest resembles your diet?",
  });
  await db.question.insert({
    order: 5,
    id: 25,
    quiz_id: 3,
    target: 4,
    type: 6,
    slider_range: "4-8",
    output_variable_name: "Sleep",
    weight: 100,
    question: "On average how many hours of sleep do you get a night?",
  });
  await db.question.insert({
    order: 6,
    id: 26,
    quiz_id: 3,
    target: 4,
    type: 6,
    slider_range: "0-6",
    output_variable_name: "Blue Light",
    weight: 100,
    question: "How many hours a day do you sit in front of a screen, ex phone, computer, tv etc.?",
  });
  await db.question.insert({
    order: 7,
    id: 27,
    quiz_id: 3,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Hydration",
    weight: 15,
    question: "On average, how many glasses of water do you drink a day?",
  });
  await db.question.insert({
    order: 8,
    id: 28,
    quiz_id: 3,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Pollution",
    weight: 33.33,
    question: "How much makeup do you wear on a daily basis?",
  });
  await db.question.insert({
    order: 9,
    id: 29,
    quiz_id: 3,
    target: 4,
    type: 6,
    slider_range: "0-100",
    output_variable_name: "Oxygenation",
    weight: 100,
    question: "On average, how many hours a week do you excercize?",
  });

  await db.answer.insert({ order: 1, question_id: 1, response_header: "<<<name>>>", response_arguments: '["name"]' });
  await db.answer.insert({
    order: 1,
    question_id: 2,
    answer: "<25",
    response_body: "We will focus on actives that will improving your skin health and appearance without adding anything unnecessary.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 2,
    answer: "25-40",
    response_body:
      "We will create a custom formula containing actives to ensure we maintain your optimal skin health and appearance. We will spoil you with some wonderful actives that will help delay visible signs of skin aging.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 2,
    answer: ">40",
    response_body: "We have so many luxurious actives that will work to address any of the desires that come with time and knowledge.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 3,
    answer: "Female",
  });
  await db.answer.insert({
    order: 2,
    question_id: 3,
    answer: "Male",
  });
  await db.answer.insert({
    order: 3,
    question_id: 3,
    answer: "Non-binary",
  });
  await db.answer.insert({
    order: 4,
    question_id: 3,
    answer: "Other",
  });
  await db.answer.insert({ order: 1, question_id: 4, answer: "Yes", answer_value: 100 });
  await db.answer.insert({ order: 2, question_id: 4, answer: "No", answer_value: 0 });
  await db.answer.insert({ order: 1, question_id: 5, answer: "Beard", answer_value: 100 });
  await db.answer.insert({ order: 2, question_id: 5, answer: "Stubble", answer_value: 66 });
  await db.answer.insert({ order: 3, question_id: 5, answer: "Clean", answer_value: 33 });
  await db.answer.insert({ order: 4, question_id: 5, answer: "Shaven", answer_value: 0 });
  await db.answer.insert({
    order: 1,
    question_id: 6,
    answer: "It's not",
    image_id: 2,
    response_header: "Wonderful!",
    response_body:
      "We can now eliminate many active ingredients that are just suited for sensitive skin and focus on just the wonderful actives that will perform other wonderful functions! Don’t worry we won’t be adding anything that can or will lead to extra sensitivity.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 6,
    answer: "Moderately",
    image_id: 3,
    response_header: "Noted.",
    response_body:
      "We have many wonderful ingredients that are specifically proven to be soothing even for mildly sensitive skin. We will add these along with other functional actives that are non-sensitizing.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 6,
    answer: "Extremely",
    image_id: 4,
    response_header: "Noted.",
    response_body: "We have many wonderful ingredients that are specifically proven to be soothing for sensitive skin. We will add these along with other functional actives that are non-sensitizing.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 7,
    answer: "Very Dry",
    image_id: 5,
    response_header: "Let’s hydrate!",
    response_body:
      "We will add some wonderful hydrating actives that will specifically address your dry skin needs (some of the later questions will help us determine exactly which of our hydrating actives are perfect for you based on their scientific mode of action)",
  });
  await db.answer.insert({
    order: 2,
    question_id: 7,
    answer: "Normal / Combination",
    image_id: 6,
    response_header: "We know the feeling!",
    response_body: "We have some wonderful ingredients that will maintain optimal skin hydration while controlling excess oil production.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 7,
    answer: "Very Oily",
    image_id: 7,
    response_header: "Ok! We’ll balance that out.",
    response_body: "We will make sure to add actives that will help control excess skin oiliness, while still addressing all your other skin needs.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 8,
    answer: "Hardly",
    response_header: "Great!",
    response_body: "We will now just focus on those actives you need",
  });
  await db.answer.insert({
    order: 2,
    question_id: 8,
    answer: "Sometimes",
    response_header: "Great!",
    response_body: "We'll make sure not to add any actives that may lead to breakouts in breakout-prone skin",
  });
  await db.answer.insert({
    order: 3,
    question_id: 8,
    answer: "Always",
    response_header: "Noted.",
    response_body:
      "We will add some of our amazing oil-control actives to alleviate some of the factors that can aggravate breakout prone skin. (Note: due to the personalized nature of our system we cannot make any claims to treat or prevent acne in accordance with FDA regulations.",
  });
  await db.answer.insert({ order: 1, question_id: 9, answer: 15, image_id: 8, answer_value: 100 });
  await db.answer.insert({ order: 2, question_id: 9, answer: 14, image_id: 9, answer_value: 93.33333333 });
  await db.answer.insert({ order: 3, question_id: 9, answer: 13, image_id: 10, answer_value: 86.66666667 });
  await db.answer.insert({ order: 4, question_id: 9, answer: 12, image_id: 11, answer_value: 80 });
  await db.answer.insert({ order: 5, question_id: 9, answer: 11, image_id: 12, answer_value: 73.33333333 });
  await db.answer.insert({ order: 6, question_id: 9, answer: 10, image_id: 13, answer_value: 66.66666667 });
  await db.answer.insert({ order: 7, question_id: 9, answer: 9, image_id: 14, answer_value: 60 });
  await db.answer.insert({ order: 8, question_id: 9, answer: 8, image_id: 15, answer_value: 53.33333333 });
  await db.answer.insert({ order: 9, question_id: 9, answer: 7, image_id: 16, answer_value: 46.66666667 });
  await db.answer.insert({ order: 10, question_id: 9, answer: 6, image_id: 17, answer_value: 40 });
  await db.answer.insert({ order: 11, question_id: 9, answer: 5, image_id: 18, answer_value: 33.33333333 });
  await db.answer.insert({ order: 12, question_id: 9, answer: 4, image_id: 19, answer_value: 26.66666667 });
  await db.answer.insert({ order: 13, question_id: 9, answer: 3, image_id: 20, answer_value: 20 });
  await db.answer.insert({ order: 14, question_id: 9, answer: 2, image_id: 21, answer_value: 13.33333333 });
  await db.answer.insert({ order: 15, question_id: 9, answer: 1, image_id: 22, answer_value: 6.666666667 });
  await db.answer.insert({
    order: 1,
    question_id: 10,
    answer: "Never",
    response_body: "Keep the sunscreen close! We’ll make sure to add some wonderful actives that will help you with your beautiful glow",
  });
  await db.answer.insert({
    order: 2,
    question_id: 10,
    answer: "Sometimes",
    response_body: "Don’t forget the sunscreen! We’ll make sure to add some wonderful actives that will help you with your beautiful glow",
  });
  await db.answer.insert({
    order: 3,
    question_id: 10,
    answer: "Always",
    response_body: "We’ll make sure to add some wonderful actives that will help you with your beautiful glow.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 11,
    answer: "Yes",
    response_body: "We’ll add some of our wonderful actives that will minimize the appearance of any hyper or hypo-pigmentation.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 11,
    answer: "No",
    response_body: "Great, we can eliminate the addition of unnecessary actives and only focus on those that you need.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 12,
    answer: "Instant Burn",
    response_header: "We hear your pain!",
    response_body: "Make sure to wear proper SPF and we’ll make sure we add actives that are not sun-sensitizing.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 12,
    answer: "Middle",
    response_header: "Noted.",
    response_body: "Make sure to wear proper SPF and we’ll make sure we add actives that will not make your skin extra sensitive to the sun during the day.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 12,
    answer: "Hardly ever",
    response_header: "Lucky!",
    response_body: "We can focus on all the great actives your skin needs without the sun’s distraction – though we still recommend using a daily SPF.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 13,
    answer: "Red? Huh? No red here",
    image_id: 23,
    response_header: "Great!",
    response_body: "We’ll just focus on the actives that you need.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 13,
    answer: "Occaisonally red & blotchy.",
    image_id: 24,
    response_header: "Noted.",
    response_body: "We have amazing actives specifically for redness – keep going till the end to find out what we have chosen specifically for your needs.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 13,
    answer: "I am constantly seeing red",
    image_id: 24,
    response_header: "Noted.",
    response_body: "We have amazing actives specifically for redness – keep going till the end to find out what we have chosen specifically for your needs.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 15,
    answer: "No Wrinkles/Lines",
    image_id: 25,
    response_header: "Amazing <<<name>>>,",
    response_body:
      "We have some amazing anti-wrinkle actives, most with more than ten letters, and you don’t need any of them. Save your money to splurge on things that will actually do something for you.",
    response_arguments: '["name"]',
  });
  await db.answer.insert({
    order: 2,
    question_id: 15,
    answer: "A Few Lines",
    hide_answer: true,
    image_id: 26,
    response_body: "We have some wonderful actives that will minimize the appearance of lines. We’ll just focus on those that will give you the best bang for your buck.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 15,
    answer: "A Few Lines Observable at all times",
    hide_answer: true,
    image_id: 27,
    response_body: "We have some wonderful actives that will minimize the appearance of lines. We’ll just focus on those that will give you the best bang for your buck.",
  });
  await db.answer.insert({
    order: 4,
    question_id: 15,
    answer: "Some Lines",
    image_id: 28,
    response_body: "We have some wonderful actives that will minimize the appearance of lines. We’ll just focus on those that will give you the best bang for your buck.",
  });
  await db.answer.insert({
    order: 5,
    question_id: 15,
    answer: "Lines Plus Hints of Wrinkles",
    hide_answer: true,
    image_id: 29,
    response_body: "We have some wonderful actives that will minimize the appearance of lines. We’ll just focus on those that will give you the best bang for your buck.",
  });
  await db.answer.insert({
    order: 6,
    question_id: 15,
    answer: "A Few Wrinkles",
    hide_answer: true,
    image_id: 30,
    response_header: "We’re going to add some of our luxurious anti-wrinkle actives. Keep going till the end to see what we recommend.",
  });
  await db.answer.insert({
    order: 7,
    question_id: 15,
    answer: "Lots of Wrinkles",
    image_id: 31,
    response_header: "We’re going to add some of our luxurious anti-wrinkle actives. Keep going till the end to see what we recommend.",
  });

  await db.answer.insert({
    order: 1,
    question_id: 16,
    answer: "Firm as a baby",
    response_header: "Amazing!!",
    response_body: "We’ll focus on the actives more appropriate to your skin and ensure we maintain your skin’s natural resilience.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 16,
    answer: "Middle",
    response_body: "We’ll add some luxurious actives to your formulation that will help prevent and improve your skins firmness.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 16,
    answer: "Sagging",
    response_header: "We got you!",
    response_body: "We’ll add some of our wonderful actives that will improve your skin’s appearance of firmness.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 17,
    answer: "No - smooth as can be",
    response_header: "Lucky you!",
    response_body: "We can eliminate actives that will just be extra clutter for your wonderful skin.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 17,
    answer: "Some",
    response_body: "We’ll keep this in mind (our algorithm’s mind) as we create your perfect formula.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 17,
    answer: "A lot",
    response_body: "We’ll keep this in mind (our algorithm’s mind) as we create your perfect formula.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 18,
    answer: "No",
  });
  await db.answer.insert({
    order: 2,
    question_id: 18,
    answer: "Some",
  });
  await db.answer.insert({
    order: 3,
    question_id: 18,
    answer: "A lot",
  });
  await db.answer.insert({ order: 1, question_id: 19, answer: "Yes", answer_value: 100 });
  await db.answer.insert({ order: 2, question_id: 19, answer: "No", response_header: "Lucky You!", answer_value: 0 });

  await db.answer.insert({ order: 1, question_id: 20, answer: "Banana" });
  await db.answer.insert({ order: 2, question_id: 20, answer: "Olive" });
  await db.answer.insert({ order: 3, question_id: 20, answer: "Sunflowers" });
  await db.active.bulkCreate([
    {
      id: 1,
      name: "Acai",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"70","Hydration":"70","Breakouts":"","Color":"","Sun":"90","Hyperpigmentation":"50","Hypopigmentation":"","Redness":"90","Lines":"90","Firmness":"90","Pores":"20","Blackheads":"10","Allergies":"","Pollution":"70","Temperature":"","Stress":"70","Diet":"","Sleep":"20","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 2,
      name: "Bakuchiol",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"0","Breakouts":"100","Color":"","Sun":"100","Hyperpigmentation":"100","Hypopigmentation":"","Redness":"90","Lines":"100","Firmness":"100","Pores":"50","Blackheads":"80","Allergies":"","Pollution":"0","Temperature":"","Stress":"0","Diet":"","Sleep":"80","Blue Light":"","Oxygenation":"80"}',
    },
    {
      id: 3,
      name: "Base",
      variables_scores: null,
    },
    {
      id: 4,
      name: "Base Refill",
      variables_scores: null,
    },
    {
      id: 5,
      name: "Chamomile",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"90","Hydration":"90","Breakouts":"70","Color":"","Sun":"90","Hyperpigmentation":"70","Hypopigmentation":"","Redness":"100","Lines":"90","Firmness":"90","Pores":"40","Blackheads":"50","Allergies":"","Pollution":"80","Temperature":"","Stress":"10","Diet":"","Sleep":"40","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 6,
      name: "Chia",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"90","Hydration":"70","Breakouts":"100","Color":"","Sun":"90","Hyperpigmentation":"70","Hypopigmentation":"","Redness":"20","Lines":"60","Firmness":"40","Pores":"80","Blackheads":"100","Allergies":"","Pollution":"50","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 7,
      name: "Coconut",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"100","Breakouts":"30","Color":"","Sun":"90","Hyperpigmentation":"20","Hypopigmentation":"","Redness":"70","Lines":"40","Firmness":"40","Pores":"20","Blackheads":"0","Allergies":"","Pollution":"80","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 8,
      name: "Cogon Grass",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"40","Hydration":"100","Breakouts":"20","Color":"","Sun":"90","Hyperpigmentation":"40","Hypopigmentation":"","Redness":"10","Lines":"80","Firmness":"80","Pores":"20","Blackheads":"10","Allergies":"","Pollution":"10","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 9,
      name: "Cucumber",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"100","Breakouts":"60","Color":"","Sun":"90","Hyperpigmentation":"20","Hypopigmentation":"","Redness":"80","Lines":"60","Firmness":"60","Pores":"50","Blackheads":"20","Allergies":"","Pollution":"40","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 10,
      name: "Dragon's Blood",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"80","Breakouts":"70","Color":"","Sun":"90","Hyperpigmentation":"50","Hypopigmentation":"","Redness":"80","Lines":"100","Firmness":"100","Pores":"20","Blackheads":"20","Allergies":"","Pollution":"80","Temperature":"","Stress":"80","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 11,
      name: "Ginseng",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"80","Hydration":"10","Breakouts":"30","Color":"","Sun":"100","Hyperpigmentation":"50","Hypopigmentation":"","Redness":"70","Lines":"100","Firmness":"100","Pores":"10","Blackheads":"10","Allergies":"","Pollution":"90","Temperature":"","Stress":"10","Diet":"","Sleep":"20","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 12,
      name: "Gotu Kola",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"90","Hydration":"80","Breakouts":"60","Color":"","Sun":"90","Hyperpigmentation":"60","Hypopigmentation":"","Redness":"90","Lines":"70","Firmness":"70","Pores":"60","Blackheads":"20","Allergies":"","Pollution":"70","Temperature":"","Stress":"10","Diet":"","Sleep":"50","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 13,
      name: "Licorice Root",
      variables_scores:
        '{"Bio Age":"","Age":"","Gender":"","Pregnancy":"","Hair":"","Sensitivity":"0","Hydration":"0","Breakouts":"10","Color":"","Sun":"40","Hyperpigmentation":"100","Hypopigmentation":"","Redness":"90","Lines":"60","Firmness":"20","Pores":"10","Blackheads":"10","Allergies":"","Pollution":"30","Temperature":"","Stress":"10","Diet":"","Sleep":"70","Blue Light":"","Oxygenation":""}',
    },
    {
      id: 14,
      name: "Moringa",
      variables_scores: null,
    },
    {
      id: 15,
      name: "Moth Bean",
      variables_scores: null,
    },
    {
      id: 16,
      name: "Mushrooms",
      variables_scores: null,
    },
    {
      id: 17,
      name: "Oatmeal",
      variables_scores: null,
    },
    {
      id: 18,
      name: "Okra",
      variables_scores: null,
    },
    {
      id: 19,
      name: "Olive Squalane",
      variables_scores: null,
    },
    {
      id: 20,
      name: "Red Raddish",
      variables_scores: null,
    },
    {
      id: 21,
      name: "Rose Hip",
      variables_scores: null,
    },
    {
      id: 22,
      name: "Sake Extract",
      variables_scores: null,
    },
    {
      id: 23,
      name: "Sandalwood",
      variables_scores: null,
    },
    {
      id: 24,
      name: "Tonka Bean",
      variables_scores: null,
    },
    {
      id: 25,
      name: "White Willow Bark",
      variables_scores: null,
    },
    {
      id: 26,
      name: "Yeast Extract",
      variables_scores: null,
    },
  ]);
  await db.answer.insert({
    order: 1,
    question_id: 22,
    answer: "Never",
    response_header: "Great!",
    response_body: "This means your skin is exposed to less pollution and better oxygenation!",
  });
  await db.answer.insert({
    order: 2,
    question_id: 22,
    answer: "Sometimes",
    response_body: "We’ll make sure to add extra actives to address the pollution your skin is exposed to.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 22,
    answer: "Multiple per day",
    response_header: "Got it.",
    response_body: "Your formula will include actives for anti-pollution and increased oxygenation to your skin.",
  });
  await db.answer.insert({
    order: 1,
    question_id: 23,
    answer: "Cool as a cucumber",
    response_header: "Lucky you!",
    response_body: "We’ll rather focus on areas that are of greater concern to you.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 23,
    answer: "Sometimes",
    response_body:
      "Occasional stress can release cortisol and other factors that can negatively affect the skin. We’ll add some adaptogens and other actives that can help mitigate some of these effects.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 23,
    answer: "In a constant state of anxiety",
    response_body: "Stress can release cortisol and other factors that can negatively affect the skin. We’ll add some adaptogens and other actives that can help mitigate some of these effects.",
  });
  await db.answer.insert({ order: 1, question_id: 24, answer: "Vegan/Vegetarian", answer_value: 0 });
  await db.answer.insert({ order: 2, question_id: 24, answer: "Flexitarian, I sometime eat meat", answer_value: 25 });
  await db.answer.insert({ order: 3, question_id: 24, answer: "Pescatarian, I’ll have fish and seafood, but no meat", answer_value: 50 });
  await db.answer.insert({ order: 4, question_id: 24, answer: "I stay away from red meat", answer_value: 75 });
  await db.answer.insert({ order: 5, question_id: 24, answer: "I eat everything", answer_value: 100 });
  await db.answer.insert({ order: 1, question_id: 25, answer: "<4" });
  await db.answer.insert({ order: 2, question_id: 25, answer: "5-7" });
  await db.answer.insert({ order: 3, question_id: 25, answer: "8+" });
  await db.answer.insert({
    order: 1,
    question_id: 26,
    answer: "0-2",
    response_header: "Good for you!",
    response_body:
      "Blue light emitted from screens can be harmful to your skin’s health and appearance. Your low exposure means we can rather focus on other areas to optimize your skin health and appearance.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 26,
    answer: "2-6",
    response_body:
      "Blue light emitted from screens can be harmful to your skin’s health and appearance. No worries though, we’ll add some actives, such as our innovative Rockrose extract that will help mitigate some of these effects.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 26,
    answer: "6+",
    response_body:
      "Blue light emitted from screens can affect your skin’s circadian rhythm as well as affect your skin’s health and appearance. We’ll add some actives, such as our innovative Rockrose extract that will help mitigate some of these effect",
  });
  await db.answer.insert({
    order: 1,
    question_id: 27,
    answer: "0",
    image_id: 32,
    response_body: "We’ll add extra hydrating actives, but we recommend you drink more so your skin gets nourished from within as well.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 27,
    answer: "4",
    image_id: 33,
    response_body: "We’ll add extra hydrating actives, but we recommend you drink more so your skin gets nourished from within as well.",
  });
  await db.answer.insert({
    order: 3,
    question_id: 27,
    answer: "8+",
    image_id: 34,
    response_header: "Great!",
    response_body: "You don’t need extra actives to compensate from a lack of internal hydration.",
  });
  await db.answer.insert({ order: 1, question_id: 28, answer: "None" });
  await db.answer.insert({ order: 2, question_id: 28, answer: "Full Coverage" });
  await db.answer.insert({
    order: 1,
    question_id: 29,
    answer: "Low",
    response_body: "We’ll add extra actives to give your skin an extra boost on oxygenation and nutrient delivery.",
  });
  await db.answer.insert({
    order: 2,
    question_id: 29,
    answer: "High",
    response_header: "Great!",
    response_body:
      "By exercising you are providing extra oxygenation and nutrient delivery to your skin, so we don’t have to add extra actives to do what you are already doing an even better job at. ",
  });
  await db.answer.insert({
    question_id: 30,
    order: 1,
    answer: "No",
    hide_answer: 0,
    response_header: "Great!",
    response_body: "We can eliminate the addition of unnecessary actives and only focus on those that you need. ",
  });
  await db.answer.insert({
    question_id: 30,
    order: 1,
    answer: "Yes",
    hide_answer: 0,
    response_body: "We'll add some of our wonderful actives that will minimize the appearance of hypopigmentation over time",
  });
  await db.result_profile.insert({
    id: 1,
    section_title: "Skin Sensitivity",
    output_variable_list: "[6,7,13,11,10]",
  });
  await db.result_profile.insert({
    id: 2,
    section_title: "Skin Characteristics",
    output_variable_list: "[14,15,17,16,8]",
  });
  await db.result_profile.insert({
    id: 3,
    section_title: "Environmental Factors",
    output_variable_list: "[19,21,24,25]",
  });
}

executeSeeds();
