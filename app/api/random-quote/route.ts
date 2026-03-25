import { NextResponse } from "next/server";

const quotes = [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay" },
  { text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", author: "Bill Gates" },
  { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupery" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { text: "It's not a bug; it's an undocumented feature.", author: "Anonymous" },
  { text: "In theory, there is no difference between theory and practice. But in practice, there is.", author: "Jan L. A. van de Snepscheut" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "One of my most productive days was throwing away 1,000 lines of code.", author: "Ken Thompson" },
  { text: "Deleted code is debugged code.", author: "Jeff Sickel" },
  { text: "Java is to JavaScript what car is to carpet.", author: "Chris Heilmann" },
  { text: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard" },
  { text: "If debugging is the process of removing bugs, then programming must be the process of putting them in.", author: "Edsger Dijkstra" },
  { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
  { text: "There are only two hard things in Computer Science: cache invalidation and naming things.", author: "Phil Karlton" },
  { text: "A good programmer is someone who always looks both ways before crossing a one-way street.", author: "Doug Linder" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
];

export async function GET() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return NextResponse.json(quote, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    },
  });
}
