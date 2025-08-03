// src/app/classroom/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { School, User } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const placeholderCourses = [
  {
    id: 'course-1',
    name: 'Introduction to AI',
    teacher: 'Dr. Alan Turing',
    bannerUrl: 'https://placehold.co/600x150',
    bannerHint: 'abstract purple',
    avatarUrl: 'https://placehold.co/40x40',
  },
  {
    id: 'course-2',
    name: 'Advanced Productivity',
    teacher: 'Prof. Ada Lovelace',
    bannerUrl: 'https://placehold.co/600x150',
    bannerHint: 'geometric pattern',
    avatarUrl: 'https://placehold.co/40x40',
  },
  {
    id: 'course-3',
    name: 'History of Computing',
    teacher: 'Mr. Charles Babbage',
    bannerUrl: 'https://placehold.co/600x150',
    bannerHint: 'vintage computer',
    avatarUrl: 'https://placehold.co/40x40',
  },
];

export default function ClassroomPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <School className="h-8 w-8" />
          Your Classroom
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative">
                <Image src={course.bannerUrl} alt={`${course.name} banner`} width={600} height={150} className="w-full h-24 object-cover" data-ai-hint={course.bannerHint} />
                <div className="absolute bottom-4 left-4">
                  <CardTitle className="text-white text-xl drop-shadow-md">{course.name}</CardTitle>
                  <CardDescription className="text-white/90 drop-shadow-sm">{course.teacher}</CardDescription>
                </div>
                 <Avatar className="h-16 w-16 border-4 border-card absolute -bottom-8 right-4">
                      <AvatarImage src={course.avatarUrl} />
                      <AvatarFallback><User/></AvatarFallback>
                  </Avatar>
              </div>
            </CardHeader>
            <CardContent className="pt-10">
              <p className="text-muted-foreground text-sm">Upcoming: Mid-term project due Friday.</p>
            </CardContent>
            <CardFooter className="bg-muted/50 p-3">
              <Button variant="link" size="sm">View course</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">This is a placeholder page.</p>
          <p className="text-sm text-muted-foreground">Full Google Classroom integration would require API setup in the Google Cloud Console.</p>
      </div>
    </div>
  );
}
