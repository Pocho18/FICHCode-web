import { Interpreter } from "./core/Interpreter";
import { Lexer } from "./core/Lexer";
import { Parser } from "./core/Parser";

export async function exec(source: string) {
    const lexer = new Lexer(source)
    const parse = new Parser(lexer.tokenize())
    const interpreter = new Interpreter()

    await interpreter.run(parse.parse())
}