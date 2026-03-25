import { NextResponse } from "next/server";

const jokes = [
  { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs." },
  { setup: "How many programmers does it take to change a light bulb?", punchline: "None, that's a hardware problem." },
  { setup: "Why do Java developers wear glasses?", punchline: "Because they can't C#." },
  { setup: "What's a programmer's favorite hangout place?", punchline: "Foo Bar." },
  { setup: "Why was the JavaScript developer sad?", punchline: "Because he didn't Node how to Express himself." },
  { setup: "What do you call a programmer from Finland?", punchline: "Nerdic." },
  { setup: "Why did the developer go broke?", punchline: "Because he used up all his cache." },
  { setup: "What's the object-oriented way to become wealthy?", punchline: "Inheritance." },
  { setup: "Why did the functions stop calling each other?", punchline: "Because they got into too many arguments." },
  { setup: "What's a programmer's least favorite type of music?", punchline: "A-gore-ithm." },
  { setup: "Why do Python programmers have low self-esteem?", punchline: "They're constantly comparing themselves to others." },
  { setup: "What did the router say to the doctor?", punchline: "It hurts when IP." },
  { setup: "Why did the programmer quit his job?", punchline: "Because he didn't get arrays." },
  { setup: "How do you comfort a JavaScript bug?", punchline: "You console it." },
  { setup: "Why was the developer unhappy at their job?", punchline: "They wanted arrays." },
  { setup: "What is a programmer's favorite fruit?", punchline: "A Pi-neapple." },
  { setup: "Why do programmers always mix up Halloween and Christmas?", punchline: "Because Oct 31 == Dec 25." },
  { setup: "What do computers eat for a snack?", punchline: "Microchips." },
  { setup: "How do trees access the internet?", punchline: "They log in." },
  { setup: "Why did the CSS developer leave the restaurant?", punchline: "They didn't like the table layout." },
];

export async function GET() {
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  return NextResponse.json(joke, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    },
  });
}
