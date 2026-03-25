"use client";
import { useState } from "react";

interface Course {
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { name: "", credits: 3, grade: "A" },
    { name: "", credits: 3, grade: "B+" },
    { name: "", credits: 4, grade: "A-" },
    { name: "", credits: 3, grade: "B" },
  ]);

  const addCourse = () => setCourses([...courses, { name: "", credits: 3, grade: "A" }]);
  const removeCourse = (i: number) => setCourses(courses.filter((_, idx) => idx !== i));
  const updateCourse = (i: number, field: keyof Course, value: string | number) => {
    const copy = [...courses];
    (copy[i] as any)[field] = value;
    setCourses(copy);
  };

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalPoints = courses.reduce((sum, c) => sum + c.credits * (gradePoints[c.grade] || 0), 0);
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  const getColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-emerald-400";
    if (gpa >= 3.0) return "text-blue-400";
    if (gpa >= 2.0) return "text-yellow-400";
    return "text-red-400";
  };

  const getLabel = (gpa: number) => {
    if (gpa >= 3.9) return "Summa Cum Laude";
    if (gpa >= 3.7) return "Magna Cum Laude";
    if (gpa >= 3.5) return "Cum Laude";
    if (gpa >= 3.0) return "Dean's List";
    if (gpa >= 2.0) return "Good Standing";
    return "Academic Probation";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">GPA Calculator</h1>
        <p className="text-[var(--text-secondary)]">
          Calculate your GPA based on grades and credit hours. Add courses and see your cumulative GPA instantly. Free online GPA calculator.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
          <p className="text-xs text-gray-400 mb-1">Your GPA</p>
          <p className={`text-5xl font-bold ${getColor(gpa)}`}>{gpa.toFixed(2)}</p>
          <p className={`text-sm mt-1 ${getColor(gpa)}`}>{getLabel(gpa)}</p>
          <p className="text-xs text-gray-500 mt-2">{totalCredits} credit hours · {totalPoints.toFixed(1)} quality points</p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-bold">
            <div className="col-span-5">Course Name</div>
            <div className="col-span-2 text-center">Credits</div>
            <div className="col-span-3 text-center">Grade</div>
            <div className="col-span-2 text-center">Points</div>
          </div>

          {courses.map((course, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input
                value={course.name}
                onChange={(e) => updateCourse(i, "name", e.target.value)}
                placeholder={`Course ${i + 1}`}
                className="col-span-5 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm"
              />
              <select
                value={course.credits}
                onChange={(e) => updateCourse(i, "credits", Number(e.target.value))}
                className="col-span-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-1 py-1.5 text-white text-sm text-center"
              >
                {[1, 2, 3, 4, 5, 6].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={course.grade}
                onChange={(e) => updateCourse(i, "grade", e.target.value)}
                className="col-span-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-1 py-1.5 text-white text-sm text-center"
              >
                {Object.keys(gradePoints).map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <div className="col-span-1 text-center text-sm text-gray-400 font-mono">
                {(course.credits * (gradePoints[course.grade] || 0)).toFixed(1)}
              </div>
              <button onClick={() => removeCourse(i)} className="col-span-1 text-red-400 hover:text-red-300 text-xs text-center">✕</button>
            </div>
          ))}

          <button onClick={addCourse} className="w-full text-sm text-purple-400 hover:text-purple-300 py-2">+ Add Course</button>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
          <h3 className="font-bold text-white mb-1">Grade Scale</h3>
          <div className="grid grid-cols-4 gap-1">
            {Object.entries(gradePoints).map(([grade, points]) => (
              <div key={grade} className="flex justify-between">
                <span>{grade}</span>
                <span className="text-white font-mono">{points.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
