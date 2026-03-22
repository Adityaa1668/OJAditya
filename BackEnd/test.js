import executeCpp from './Compiler/executeCpp.js';
import generateFile from './Compiler/generateFile.js';
import generateInputFile from './Compiler/generateInputFile.js';

async function test() {
    const code = `#include <iostream>
using namespace std;
int main() {
  int x;
  cin >> x;
  cout << "You entered: " << x << endl;
  return 0;
}`;
    console.log("Generating code file...");
    const filePath = await generateFile("cpp", code);
    console.log("File path:", filePath);

    console.log("Executing without input...");
    try {
        const out1 = await executeCpp(filePath, null, 2000);
        console.log("Out1:", out1);
    } catch (e) {
        console.log("Err1:", e);
    }

    console.log("Executing with input...");
    try {
        const inPath = await generateInputFile("42");
        console.log("Input path:", inPath);
        const out2 = await executeCpp(filePath, inPath, 5000);
        console.log("Out2:", out2);
    } catch (e) {
        console.log("Err2:", e);
    }
}

test();
