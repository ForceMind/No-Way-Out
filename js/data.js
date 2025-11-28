import { citizenData } from './stories/citizen.js';
import { refugeeData } from './stories/refugee.js';
import { studentData } from './stories/student.js';
import { teacherData } from './stories/teacher.js';
import { doctorData } from './stories/doctor.js';
import { merchantData } from './stories/merchant.js';
import { farmerData } from './stories/farmer.js';
import { agentData } from './stories/agent.js';
import { orphanData } from './stories/orphan.js';
import { nunData } from './stories/nun.js';
import { hoboData } from './stories/hobo.js';
import { driverData } from './stories/driver.js';

export const storyData = {
    citizen: citizenData,
    refugee: refugeeData,
    student: studentData,
    teacher: teacherData,
    doctor: doctorData,
    merchant: merchantData,
    farmer: farmerData,
    agent: agentData,
    orphan: orphanData,
    nun: nunData,
    hobo: hoboData,
    driver: driverData
};

export const identities = [
    { id: 'citizen', name: '普通市民', desc: '你是南京的普通市民，日军的铁蹄践踏了你的家园。' },
    { id: 'refugee', name: '难民', desc: '你背井离乡，带着一家老小逃到南京城，却发现此处更危险。' },
    { id: 'student', name: '学生', desc: '你是中央大学的学生，书本无法告诉你该如何面对眼前的屠戮。' },
    { id: 'teacher', name: '教师', desc: '作为教师，你想保护学生，但力量显得渺小。' },
    { id: 'doctor', name: '医生', desc: '你是城里的医生，满目疮痍让你不得不选择去救谁。' },
    { id: 'merchant', name: '商人', desc: '你曾经富有，但财富换不来安全。' },
    { id: 'farmer', name: '农夫', desc: '你是乡下的农夫，被逼进城找寻生路。' },
    { id: 'agent', name: '地下党员', desc: '你是地下工作者，使命是传递情报与救人。' },
    { id: 'orphan', name: '孤儿', desc: '你无家可归，只能在废墟中寻找生存的机会。' },
    { id: 'nun', name: '修女', desc: '你在教堂里避难，想为弱者提供庇护。' },
    { id: 'hobo', name: '流浪汉', desc: '你无处可去，只能在废墟间寻找残羹冷炙。' },
    { id: 'driver', name: '车夫', desc: '你拉着破车，载着希望与恐惧穿行于城中。' }
];
