// const fetch = require("node-fetch");
// const jsdom = require("jsdom");

import fetch from "node-fetch";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

// Define the URLs of the two pages you want to compare

const page1URL = "https://codepen.io/Mon-Pakhi/pen/QWVamGW";
const page2URL = "https://codepen.io/ig_design/pen/JxbVRq";

// Retrieve the HTML source code for each page
const getPageSource = async (url) => {
  const response = await fetch(url);
  const html = await response.text();
  return html;
};

const comparePages = async () => {
  const page1HTML = await getPageSource(page1URL);
  const page2HTML = await getPageSource(page2URL);

  // Parse the HTML into DOM objects
  const parseHTML = (html) => {
    const dom = new JSDOM(html);
    return dom.window.document;
  };

  const page1DOM = parseHTML(page1HTML);
  const page2DOM = parseHTML(page2HTML);

  // Define a function to extract relevant design information from a DOM object
  const extractDesignInfo = (dom) => {
    const relevantElements = dom.querySelectorAll("body *"); // Select all elements within the <body> tag
    const designInfo = {
      elementCount: relevantElements.length,
      colorSchemes: new Set(),
      fontFamilies: new Set(),
      // Add more properties here as needed
    };
    relevantElements.forEach((el) => {
      const styles = el.ownerDocument.defaultView.getComputedStyle(el);
      designInfo.colorSchemes.add(styles.backgroundColor + "|" + styles.color); // Store background and text colors as a combined string
      designInfo.fontFamilies.add(styles.fontFamily);
      // Add more design properties here as needed
    });
    return designInfo;
  };

  // Extract the design information for each page
  const page1Design = extractDesignInfo(page1DOM);
  const page2Design = extractDesignInfo(page2DOM);

  // Define a function to calculate the similarity score between two sets
  const jaccardIndex = (set1, set2) => {
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  };

  // Compare the design information for each page and calculate a similarity score
  const similarityScore = () => {
    const colorSimilarity = jaccardIndex(
      page1Design.colorSchemes,
      page2Design.colorSchemes
    );
    const fontSimilarity = jaccardIndex(
      page1Design.fontFamilies,
      page2Design.fontFamilies
    );
    // Add more design properties here as needed
    return (colorSimilarity + fontSimilarity) / 2; // Average the similarity scores for all properties
  };

  const score = similarityScore();
  console.log("The design similarity score is:", Math.floor(score * 100));
};

comparePages();
