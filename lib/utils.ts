import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import UAParser from 'ua-parser-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (
  error: unknown,
  defaultMessage?: string,
): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = defaultMessage || 'something went wrong';
  }
  return message;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const updateFavicon = (url: string) => {
  const link = document.querySelector(
    "link[rel='icon']",
  ) as HTMLLinkElement | null;
  if (link) {
    link.href = url;
  } else {
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.href = url;
    document.head.appendChild(newLink);
  }
};

export const isFirefox = (): boolean => {
  return navigator.userAgent.toLowerCase().includes('firefox');
};

export function htmlToString(html: string): string[] {
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x3C;': '<',
    '&#x3E;': '>',
    '&#x3D;': '=',
  };

  const regex: RegExp = /&[a-z]+;|&#\d+;|&#x[a-f0-9]+;/gi;

  const text: string = html
    .replace(regex, (match: string) => {
      if (entities[match]) {
        return entities[match];
      } else {
        return match;
      }
    })
    .replace(/<[^>]+>/g, '');

  const lines: string[] = text.split('\n');

  return lines.map((line: string) => {
    return line.replace(/&emsp;/g, '\u2003');
  });
}
export const supportedLanguages = [
  'javascript',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'swift',
  'ruby',
  'php',
  'go',
  'rust',
  'kotlin',
  'typescript',
  'scala',
  'perl',
  'sql',
  'bash',
];

const basicCodeSnippets = {
  javascript: `// JavaScript code\nconsole.log("Hello World!");`,
  python: `# Python code\nprint("Hello World!")`,
  java: `// Java code\npublic class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}`,
  c: `// C code\n#include <stdio.h>\n\nint main() {\n  printf("Hello World!\\n");\n  return 0;\n}`,
  cpp: `// C++ code\n#include <iostream>\n\nint main() {\n  std::cout << "Hello World!" << std::endl;\n  return 0;\n}`,
  csharp: `// C# code\nusing System;\n\npublic class HelloWorld {\n  public static void Main(string[] args) {\n    Console.WriteLine("Hello World!");\n  }\n}`,
  swift: `// Swift code\nprint("Hello World!")`,
  ruby: `# Ruby code\nputs "Hello World!"`,
  php: `// PHP code\n<?php\necho "Hello World!";\n?>`,
  go: `// Go code\npackage main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello World!")\n}`,
  rust: `// Rust code\nfn main() {\n  println!("Hello World!");\n}`,
  kotlin: `// Kotlin code\nfun main() {\n  println("Hello World!")\n}`,
  typescript: `// TypeScript code\nconsole.log("Hello World!");`,
  scala: `// Scala code\nobject HelloWorld {\n  def main(args: Array[String]) {\n    println("Hello World!")\n  }\n}`,
  perl: `# Perl code\nprint "Hello World!\\n";`,
  sql: `-- SQL code\nSELECT 'Hello World!' AS message;`,
  bash: `# Bash code\necho "Hello World!"`,
};

export type SupportedLanguage = keyof typeof basicCodeSnippets;

export const getBasicCodeSnippets = (language: SupportedLanguage) => {
  return basicCodeSnippets[language];
};

export const getSystemDetails = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  console.log({ result });
  const systemInfo = {
    name: result.browser.name, // Browser name (e.g., Chrome)
    browserVersion: result.browser.version, // Browser version
    os: result.os.name, // Operating System (e.g., Windows)
    osVersion: result.os.version, // OS version
    device: result.device.model, // Device model (e.g., iPhone, Pixel)
    deviceType: result.device.type, // Device type (e.g., mobile, tablet, desktop)
    cpu: result.cpu.architecture, // CPU architecture (e.g., x64)
  };

  return systemInfo;
};

export const getBrowserOsImage = (
  browser: string | undefined,
  os: string | undefined,
): string => {
  // Combined browser + OS mapping to images
  const browserOsImageMap: Record<string, string> = {
    ['Chrome_Windows']: '/assets/mac-brave-share.png',
    ['Chrome_Mac OS']: '/assets/mac-brave-share.png',
    Chrome_Linux: '/assets/mac-brave-share.png',
    ['Firefox_Windows']: '/assets/mac-brave-share.png',
    ['Firefox_Mac OS']: '/assets/mac-firefox-share.png',
    Firefox_Linux: '/assets/mac-brave-share.png',
    ['Safari_Mac OS']: '/assets/mac-safari-share.png',
    ['Edge_Windows']: '/assets/mac-brave-share.png',
    ['Edge_Mac OS']: '/assets/mac-brave-share.png',
    ['Brave_Windows']: '/assets/mac-brave-share.png',
    ['Brave_Mac OS']: '/assets/mac-brave-share.png',
    ['Chrome_Android']: '/assets/mac-brave-share.png',
    ['Unknown_Unknown']: '/assets/mac-brave-share.png', // Fallback image if combination is unknown
  };

  // Create a key by combining browser and OS
  const browserOsKey = `${browser}_${os}`;

  console.log({ browserOsKey });

  // Return the corresponding image based on the browser + OS combination
  return browserOsImageMap[browserOsKey] || browserOsImageMap['Default'];
};

export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      console.error('Local storage is not available');
    }
  } catch (error) {
    console.error(`Error saving to local storage:`);
  }
};

export const getFromLocalStorage = (key: string): any => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else {
      console.error('Local storage is not available');
      return null;
    }
  } catch (error) {
    console.error(`Error getting from local storage`);
    return null;
  }
};

export const saveToCookies = (
  key: string,
  value: any,
  days: number = 30,
): void => {
  try {
    if (typeof window !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
    } else {
      console.error('Window is not available (likely server-side)');
    }
  } catch (error) {
    console.error('Error saving to cookies:', error);
  }
};

export const getFromCookies = (key: string): any => {
  try {
    if (typeof window !== 'undefined') {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`))
        ?.split('=')[1];
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    } else {
      console.error('Window is not available (likely server-side)');
      return null;
    }
  } catch (error) {
    console.error('Error getting from cookies:', error);
    return null;
  }
};

export const isOnLine = (): boolean => {
  return navigator.onLine;
};

/**
 * Increments a numeric value stored in local storage by a specified amount.
 *
 * @param {string} key - The key of the item in local storage.
 * @param {number} [initialValue=0] - The initial value to use if the item does not exist or is not a number.
 * @param {number} [incrementBy=1] - The amount to increment the stored value by.
 */
export const incrementLocalStorageValue = (
  key: string,
  initialValue: number = 0,
  incrementBy: number = 1,
) => {
  // Retrieve the current value from local storage and convert it to a number
  let currentValue = Number(localStorage.getItem(key));

  // If the current value is not a valid number, use the initial value
  if (isNaN(currentValue)) currentValue = initialValue;

  // Update the item in local storage with the incremented value
  localStorage.setItem(key, String(currentValue + incrementBy));
};

//  example jsong data //
const jsonData =
  '{"basicInfo":{"fullName":"preetgur","age":28},"socialProfiles":{"github":"preetgur","stackoverflow":"stackoverflow0137","linkedin":"https://www.linkedin.com/ab","facebook":"https://www.facebook.com/ad"},"certifications":[{"certificate_name":"AWS","link":"https://certificate.com","certifying_authority":""},{"certificate_name":"","link":"","certifying_authority":""},{"certificate_name":"google.com","certifying_authority":"Google"}],"candidate_id":1828,"job_posting_id":293}';

const data = JSON.parse(jsonData);

/**
 * Filters out empty objects or arrays from the input object or array.
 * @param obj - The input object or array.
 * @returns The filtered object or array.
 */
export function filterEmptyObjects<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => !isEmpty(item))
      .map((item) =>
        typeof item === 'object' ? filterEmptyObjects(item) : item,
      ) as T;
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => {
        if (Array.isArray(value)) {
          const filteredArray = filterEmptyObjects(value);
          return filteredArray.length > 0;
        } else {
          return !isEmpty(value);
        }
      }),
    ) as T;
  } else {
    return obj;
  }
}

/**
 * Checks if an object, array, or primitive is empty.
 * @param obj - The value to check.
 * @returns True if the value is empty, false otherwise.
 */
function isEmpty(obj: unknown): boolean {
  if (Array.isArray(obj)) {
    return obj.every(isEmpty);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.values(obj).every(
      (value) => value === null || value === undefined || value === '',
    );
  } else {
    return obj === null || obj === undefined || obj === '';
  }
}

/**
 * Checks if a value has any truthy values.
 * Works for arrays and objects.
 * @param value - The value to check.
 * @returns True if the value has any truthy properties or elements, false otherwise.
 */
function hasAnyTruthyValues(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => hasAnyTruthyValues(item));
  } else if (typeof value === 'object' && value !== null) {
    return Object.values(value).some((v) => hasAnyTruthyValues(v));
  } else {
    return Boolean(value);
  }
}

/**
 * Filters arrays containing only falsy values from an object or array.
 * @param obj - The input object or array.
 * @returns The filtered object or array.
 */
export function filterEmptyArrays<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => hasAnyTruthyValues(item))
      .map((item) =>
        typeof item === 'object' ? filterEmptyArrays(item) : item,
      ) as T;
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, filterEmptyArrays(value)];
        } else if (typeof value === 'object' && value !== null) {
          return [key, filterEmptyArrays(value)];
        } else {
          return [key, value];
        }
      }),
    ) as T;
  } else {
    return obj;
  }
}

export const parseNumberValue = (
  value: string,
  step: string,
): number | string => {
  if (!value) return '';

  return step === '1' ? parseInt(value, 10) : parseFloat(value);
};
