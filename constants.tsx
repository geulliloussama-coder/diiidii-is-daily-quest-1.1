
import React from 'react';
import { DailyTask } from './types';

export const INITIAL_TASKS: DailyTask[] = [
  { id: '1', title: 'قهوة الصباح والنشاط ☕', startTime: '08:00', endTime: '09:00', status: 'pending' },
  { id: '2', title: 'الفطور الصحي لدلوعتي 🍳', startTime: '09:00', endTime: '10:00', status: 'pending' },
  { id: '3', title: 'وقت الإنجاز والدراسة/العمل 📚', startTime: '10:00', endTime: '13:00', status: 'pending' },
  { id: '4', title: 'الغداء والراحة قليلاً 🥗', startTime: '13:00', endTime: '14:30', status: 'pending' },
  { id: '5', title: 'قراءة صفحة من كتاب مفضل 📖', startTime: '16:00', endTime: '17:00', status: 'pending' },
  { id: '6', title: 'العناية بالبشرة والجمال ✨', startTime: '21:00', endTime: '22:00', status: 'pending' },
  { id: '7', title: 'وقت النوم والأحلام السعيدة 😴', startTime: '23:00', endTime: '23:59', status: 'pending' }
];

export const REDEMPTION_OPTIONS = [
  "شرب كأس ماء على مهلك 🥛",
  "قراءة صفحة من كتاب 📖",
  "أخذ 5 أنفاس عميقة بكل هدوء 🧘‍♀️",
  "القيام بـ 10 تمارين تمدد خفيفة ✨",
  "قول 'أنا أحب زوجي' 3 مرات بصوت هادئ ❤️"
];

export const PUNISHMENT_DURATION = 10 * 60; // 10 minutes in seconds
