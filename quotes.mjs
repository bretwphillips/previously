// One quote a day, chosen by date so it holds still until midnight. Kept to
// lines with a solid attribution: most quote lists are full of Einstein and
// Twain saying things they never said.
const QUOTES = [
  ["Simplicity is prerequisite for reliability.", "Edsger W. Dijkstra"],
  ["Programs must be written for people to read, and only incidentally for machines to execute.", "Harold Abelson"],
  ["Make it work, make it right, make it fast.", "Kent Beck"],
  ["Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", "Martin Fowler"],
  ["Talk is cheap. Show me the code.", "Linus Torvalds"],
  ["Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.", "Antoine de Saint-Exupéry"],
  ["Well begun is half done.", "Aristotle"],
  ["We are what we repeatedly do. Excellence, then, is not an act, but a habit.", "Will Durant"],
  ["Real artists ship.", "Steve Jobs"],
  ["Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.", "Brian Kernighan"],
  ["Controlling complexity is the essence of computer programming.", "Brian Kernighan"],
  ["The most effective debugging tool is still careful thought, coupled with judiciously placed print statements.", "Brian Kernighan"],
  ["Plans are worthless, but planning is everything.", "Dwight D. Eisenhower"],
  ["The only way to go fast is to go well.", "Robert C. Martin"],
  ["Walking on water and developing software from a specification are easy if both are frozen.", "Edward V. Berard"],
  ["Adding manpower to a late software project makes it later.", "Fred Brooks"],
  ["The function of good software is to make the complex appear to be simple.", "Grady Booch"],
  ["Code is like humor. When you have to explain it, it's bad.", "Cory House"],
  ["Optimism is an occupational hazard of programming: feedback is the treatment.", "Kent Beck"],
  ["A journey of a thousand miles begins with a single step.", "Laozi"],
  ["Do the best you can until you know better. Then when you know better, do better.", "Maya Angelou"],
  ["Simple things should be simple, complex things should be possible.", "Alan Kay"],
  ["The best way to predict the future is to invent it.", "Alan Kay"],
  ["Inside every large program is a small program struggling to get out.", "Tony Hoare"],
  ["There are two ways of constructing a software design: one way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.", "Tony Hoare"],
  ["Deleted code is debugged code.", "Jeff Sickel"],
  ["One of my most productive days was throwing away 1,000 lines of code.", "Ken Thompson"],
  ["When in doubt, use brute force.", "Ken Thompson"],
  ["Beware of bugs in the above code; I have only proved it correct, not tried it.", "Donald Knuth"],
  ["Testing shows the presence, not the absence of bugs.", "Edsger W. Dijkstra"],
  ["It always takes longer than you expect, even when you take into account Hofstadter's Law.", "Douglas Hofstadter"],
  ["The first 90 percent of the code accounts for the first 90 percent of the development time. The remaining 10 percent of the code accounts for the other 90 percent.", "Tom Cargill"],
  ["Small deeds done are better than great deeds planned.", "Peter Marshall"],
  ["Nothing is particularly hard if you divide it into small jobs.", "Henry Ford"],
  ["The way to get started is to quit talking and begin doing.", "Walt Disney"],
  ["Focus is a matter of deciding what things you're not going to do.", "John Carmack"],
  ["Rest is not idleness.", "John Lubbock"],
  ["Code never lies, comments sometimes do.", "Ron Jeffries"],
  ["Make each program do one thing well.", "Doug McIlroy"],
  ["Fall seven times, stand up eight.", "Japanese proverb"],
  ["You miss 100% of the shots you don't take.", "Wayne Gretzky"],
  ["Without requirements or design, programming is the art of adding bugs to an empty text file.", "Louis Srygley"],
  ["Weeks of coding can save you hours of planning.", "Anonymous"],
];

export function quoteFor(date) {
  // Local calendar day, so the quote turns over at your midnight, not UTC's.
  const day = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
  );
  const [text, by] = QUOTES[day % QUOTES.length];
  return { text, by };
}
