
export interface StudentData {
  regNumber: string;
  name: string;
  surname: string;
  gender: "Male" | "Female";
  programme: string;
  part: "1" | "2" | "3" | "4" | "5";
  phone?: string; // Optional, students will update this in their profile
  email?: string; // Optional, will use their sign-in email
}

export const studentDatabase: StudentData[] = [
  // Bachelor of Pharmacy Honours Degree - FEMALE
  { regNumber: "H250010B", name: "VIMBAI", surname: "GATA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250011R", name: "MIGIRL", surname: "SADZA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250017V", name: "LEANDRA TINODA", surname: "CHIKWANHA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250025Z", name: "HAZEL PRISCA MADZORE", surname: "MADZORE", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250035Q", name: "NATALIE MUNOTIDA", surname: "CHIDZAMBWA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250049M", name: "TANAKA", surname: "CHIVANGA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250055G", name: "THANDIWE", surname: "MOYO", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250061J", name: "KIMBERLY ANESU", surname: "TIYATARA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250066F", name: "ROPAFADZO", surname: "MUKWANHIRI", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250086G", name: "GRACE NYASHA", surname: "CHIMWE", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250087C", name: "PATRICIA", surname: "MANDIGO", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250098J", name: "DEIDRE KUNDISO", surname: "NHETE", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250099Y", name: "CHARNAINE MUFARO", surname: "SAKAROMBE", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250100F", name: "KUNDAI DANIELLE MUGABE", surname: "MUGABE", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250115J", name: "ANENYASHA NOKUTENDA", surname: "MAPIYE", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250116Y", name: "SANDRA RUVARASHE", surname: "MANDOREBA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250121P", name: "TABETH TANATSWA", surname: "MAWOCHA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250127C", name: "POLITE", surname: "CHIKWARI", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250174M", name: "PRIDE", surname: "GANYE", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250178N", name: "COURTNEY T MAREYA", surname: "MATEYA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250186T", name: "MEMORY SHAMISO MZENGAIRI", surname: "MZENGAIRI", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250221M", name: "FADZISO", surname: "NHIRA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250249Q", name: "TARIRO MIRIAM", surname: "JAKATA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250268E", name: "ELSIE RAPELANG", surname: "NYAMUDO", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250281A", name: "TANATSWA", surname: "NYANDORO", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250290W", name: "TENDAI", surname: "MUZEZA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250292V", name: "STEPHANE RATIDZO", surname: "CHAHWANDA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250300E", name: "RUTENDO PATIENCE", surname: "MATAMBA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250325E", name: "MITCHEL CHENAI", surname: "ZIYADUMA", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250388Y", name: "RONEIWA LEONAH", surname: "MOYO", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250691N", name: "RUFARO YVONNE", surname: "PFIDZE", gender: "Female", programme: "BTECH_PHARMACY", part: "1" },

  // Bachelor of Pharmacy Honours Degree - MALE
  { regNumber: "H250016E", name: "TAPIWA HOPEWELL", surname: "MUDZIMUREGA", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250022W", name: "BERKSHOW", surname: "MTOMBENI", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250040N", name: "KIM TASHINGA", surname: "MALGAS", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250043Q", name: "TAVONGWA NATHANIEL", surname: "MUSHINYE", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250046Q", name: "TINOTENDA", surname: "MAURU", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250052F", name: "MCDONELL DAYTON", surname: "MARONGA", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250053H", name: "TAKURA", surname: "MATENGA", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250057P", name: "GERALD", surname: "MAVHUSA", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250074Q", name: "TATENDA", surname: "MAPFUMO", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250088G", name: "NATHANIEL RUFARO", surname: "CHINDENGA", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250089H", name: "ALBRIGHT TADIWANASHE", surname: "MUZIVI", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250095A", name: "TADIWANASHE HANDSON", surname: "VAMBE", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250118Z", name: "DEAN ANOTIDA", surname: "CHITAVATI", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250142T", name: "APTON", surname: "MAJURU", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250155E", name: "BLIEVINGTON", surname: "CHIMUSO", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250160B", name: "DENZEL", surname: "MACHEKANO", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250164C", name: "MUNENGONI", surname: "KUTSIRAYI", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250177A", name: "TADIWANASHE", surname: "MAPFUMO", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250190R", name: "KUDZAIISHE", surname: "MWOYOSVIYI", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250198N", name: "GODWIN", surname: "CHINAMATIRA", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250217G", name: "ADION", surname: "CHAMONYONGA", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250241N", name: "ERNEST", surname: "KWANGWARI", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250259M", name: "TADIWANASHE", surname: "SENZERE", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250273H", name: "TUNGAMIRAI", surname: "MASAKURE", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250275V", name: "GLADYWELL MUNASHE", surname: "MAWONENI", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250357Z", name: "TELSON JUNIOR", surname: "MAMBUME", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },
  { regNumber: "H250365C", name: "MUJERENYASHADZASHE", surname: "MUJERE", gender: "Male", programme: "BTECH_PHARMACY", part: "1" },

  // Bachelor of Science Honours Degree in Diagnostic Radiography - FEMALE
  { regNumber: "H250001Q", name: "KAREN", surname: "MAZANA", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250009E", name: "JOYCE MAKANAKA", surname: "GOREDEMA", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250047Y", name: "TAMIRIRAISHE", surname: "KAHARI", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250059E", name: "LANSASTA DANAISHE", surname: "KANYEMBA", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250106V", name: "BLESSING", surname: "CHIDIWURO", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250161F", name: "SHARON", surname: "NHOTI", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250264X", name: "SHILOH MUNENYASHA", surname: "MAVIVA", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250289Z", name: "MAKANAKAISHE SHAMISO", surname: "TAGWIREYI", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250297G", name: "HAZEL", surname: "MACHINDA", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250408V", name: "WILMAH TINOTENDA", surname: "MUKONYA", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250438V", name: "CLARITY", surname: "MOYO", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250690M", name: "ANGEL ANESU", surname: "CHAITEZVI", gender: "Female", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },

  // Bachelor of Science Honours Degree in Diagnostic Radiography - MALE
  { regNumber: "H250021P", name: "TAPIWANASHE", surname: "MAKWANYA", gender: "Male", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250211F", name: "TATENDA CHIKANDIWA", surname: "CHIKANDIWA", gender: "Male", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250257E", name: "PRAYTZ", surname: "CHITIYO", gender: "Male", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },
  { regNumber: "H250423N", name: "GREAT ERASMUS BALOYI", surname: "BALOYI", gender: "Male", programme: "BTECH_DIAGNOSTIC_RADIOGRAPHY", part: "1" },

  // Bachelor of Science Honours Degree in Therapeutic Radiography - FEMALE
  { regNumber: "H250104Q", name: "EDINAH", surname: "ASIMA", gender: "Female", programme: "POSTGRADUATE_ULTRASOUND", part: "1" },
  { regNumber: "H250370M", name: "ROPAFADZO NICOLE", surname: "CHIBAYA", gender: "Female", programme: "POSTGRADUATE_ULTRASOUND", part: "1" },
  { regNumber: "H250409T", name: "WANAI TENDAI", surname: "MUNDENDA", gender: "Female", programme: "POSTGRADUATE_ULTRASOUND", part: "1" },
  { regNumber: "H250498P", name: "MAZVITA", surname: "GONDWE", gender: "Female", programme: "POSTGRADUATE_ULTRASOUND", part: "1" },
  { regNumber: "H250596C", name: "MAKANAKA", surname: "MAMBOMA", gender: "Female", programme: "POSTGRADUATE_ULTRASOUND", part: "1" },

  // Bachelor of Science Honours Degree in Therapeutic Radiography - MALE
  { regNumber: "H250034P", name: "ANESU PROGRESS", surname: "NYAKUBAYA", gender: "Male", programme: "POSTGRADUATE_ULTRASOUND", part: "1" },
  { regNumber: "H250676P", name: "FRANK ROBERT", surname: "GUIBERT", gender: "Male", programme: "POSTGRADUATE_ULTRASOUND", part: "1" },

  // Bachelor of Technology Honours Degree in Biomedical Engineering - FEMALE
  { regNumber: "H250036F", name: "LOVENESS", surname: "MASASIRE", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250152W", name: "TINODAISHE SILENT", surname: "KUONA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250157C", name: "PERENCE", surname: "KUTSANZARA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250201M", name: "GAMUCHIRAI", surname: "MUKWEMBI", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250206H", name: "EVELYN RURAMAI", surname: "SANGO", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250224V", name: "NICOLEEN", surname: "NYAKUPFUKA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250226B", name: "SHANTEL", surname: "SINGWERE", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250229V", name: "NOKUTENDA CLEOPATRA", surname: "CHIKORWA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250287Y", name: "PRINCESS PAIDA", surname: "BORIWONDO", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250316E", name: "TANATSWA BEVERLY", surname: "MUSEKIWA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250330H", name: "GRACIA ROPAFADZO", surname: "KATSVAIRO", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250348J", name: "NGAATENDWE", surname: "DONDO", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250355C", name: "TINAYE COURTENEY KANDAMBI", surname: "KANDAMBI", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250361E", name: "VANESSA GAMUCHIRAI", surname: "SIBANDA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250421G", name: "TATENDA DELIGHT", surname: "KUPETA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250439C", name: "FELONCIYA", surname: "GORA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250443V", name: "EMELLY DUMOLWAYO", surname: "NGWENYA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250487N", name: "APLONIA", surname: "MUSIKA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250501P", name: "PANASHE", surname: "CHIBUNGU", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250518G", name: "PRIMROSE", surname: "SEMENDE", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250572Y", name: "RUFARO", surname: "DZINAVATONGA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250587E", name: "SHALOM", surname: "DZINGAI", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250592W", name: "RUVARASHE PATIENCE", surname: "CASETTE", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250602E", name: "NICOLE SHUMIRAI", surname: "DZVATSVA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250604N", name: "CHISEPE NATALIE", surname: "MWAMUKA", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250609N", name: "MITCHELLE FABIOLA", surname: "MURAMBI", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250610P", name: "CELINE TAKUNDA", surname: "MUTEMERI", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250619G", name: "EVERMORE", surname: "SITHOLE", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250647Q", name: "RUFARO VIOLA", surname: "KAJAUCHIRE", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250651Z", name: "WADZANAI", surname: "SANHEHWE", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250689Y", name: "BEAUTY", surname: "TAMBUDZAYI", gender: "Female", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },

  // Bachelor of Technology Honours Degree in Biomedical Engineering - MALE
  { regNumber: "H250018Y", name: "CORNELIUS TAKUNDA", surname: "MARONJESE", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250029T", name: "BYRON CHIKOMBORERO", surname: "TOGA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250070A", name: "GIFT", surname: "MATARE", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250150M", name: "TAWANANYASHA", surname: "VUTA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250175Z", name: "TANAKA PEACE", surname: "MARAZANI", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250187H", name: "MALVERN", surname: "MUZARAWA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250216J", name: "SHELTON", surname: "CHIBADA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250237M", name: "TREVOR", surname: "NGAJILA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250440X", name: "TAKUNDA PETER", surname: "GARA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250470W", name: "BRENDON I. D", surname: "NYABAWA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250508N", name: "IMMANUEL ANDREW", surname: "VHUTA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250515J", name: "DENZEL DUBE", surname: "DUBE", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250583X", name: "TAFADZWA", surname: "MARIRA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250618X", name: "TAKAWIRA JUNIOR", surname: "GATIYA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250644P", name: "ASHLEY CLARENCE", surname: "SIMOYI", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250646Z", name: "JOSHUA KUDAKWASHE", surname: "CHIKWAVA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },
  { regNumber: "H250688A", name: "RICHARD THANKS", surname: "MAVINGA", gender: "Male", programme: "BTECH_BIOMEDICAL_ENGINEERING", part: "1" },

  // Bachelor of Technology Honours Degree in Biotechnology - FEMALE
  { regNumber: "H250031Q", name: "LYNN MUNASHE TEYA", surname: "TEYA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250062G", name: "CHIDO NATALIE", surname: "MBERIKWAZVO", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250176N", name: "KAREN LINDSAY", surname: "MAZANHI", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250197W", name: "PANASHE", surname: "BONDERA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250231Q", name: "TALENT", surname: "DUBE", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250232C", name: "TINAYEMUSIKI", surname: "NYIKA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250307T", name: "NYASHA TASHINGA", surname: "NOTA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250418E", name: "VIMBAI", surname: "POTERA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250469P", name: "NYASHA BLESSED", surname: "NENGOMA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250497E", name: "TADIWA NEMHARA", surname: "HUNGWIRI", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250514A", name: "ADRIANNA", surname: "MUKWAIRA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250528J", name: "MELANIE TAFADZWA", surname: "USADA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250530E", name: "TAMARE", surname: "KANENGONI", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250560X", name: "MITCHELL", surname: "MUCHENJE", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250584J", name: "TATENDA ADELINE", surname: "MASHURO", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250600E", name: "TINOTENDA ASHLEY", surname: "CHIKASHA", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250637M", name: "NYASHADZASHE MAPFUMO", surname: "MAPFUMO", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250656N", name: "ZIMBITI LOSTA-E", surname: "ZIMBITI", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250679A", name: "ANNIE-MARIE MTEKI", surname: "MTEKI", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250686T", name: "KUNDAI KIMBERLY", surname: "SITHOLE", gender: "Female", programme: "BTECH_BIOTECHNOLOGY", part: "1" },

  // Bachelor of Technology Honours Degree in Biotechnology - MALE
  { regNumber: "H250076C", name: "ASHLEY TSEPO", surname: "MOYO", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250138Q", name: "BEKEZELA", surname: "NDLOVU", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250192C", name: "BYRON BOSTONE", surname: "SHAYANEWAKO", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250271F", name: "TAVONGA", surname: "MUPUTISI", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250347A", name: "TINASHE", surname: "MLAMBO", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250511B", name: "TAFADZWA ARNOLD CHIROZVA", surname: "CHIROZVA", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250536M", name: "ELVIS ELSON", surname: "RANDAZHA", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250667Q", name: "SALIPISIO WHATMORE", surname: "MATONDO", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250683M", name: "TADIWANASHE KASEKE", surname: "KASEKE", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
  { regNumber: "H250693A", name: "WILSON TADIWANASHE", surname: "MADENYIKA", gender: "Male", programme: "BTECH_BIOTECHNOLOGY", part: "1" },
];

// Helper function to find a student by registration number
export const findStudentByRegNumber = (regNumber: string): StudentData | undefined => {
  return studentDatabase.find(student => student.regNumber === regNumber);
};

// Helper function to get students by programme
export const getStudentsByProgramme = (programme: string): StudentData[] => {
  return studentDatabase.filter(student => student.programme === programme);
};

// Helper function to get students by gender
export const getStudentsByGender = (gender: "Male" | "Female"): StudentData[] => {
  return studentDatabase.filter(student => student.gender === gender);
};

// Helper function to get students by part
export const getStudentsByPart = (part: "1" | "2" | "3" | "4" | "5"): StudentData[] => {
  return studentDatabase.filter(student => student.part === part);
};

// Stats
export const getStudentStats = () => {
  const total = studentDatabase.length;
  const maleCount = studentDatabase.filter(s => s.gender === "Male").length;
  const femaleCount = studentDatabase.filter(s => s.gender === "Female").length;
  
  const programmeCounts = studentDatabase.reduce((acc, student) => {
    acc[student.programme] = (acc[student.programme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    maleCount,
    femaleCount,
    programmeCounts
  };
};
