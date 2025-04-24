import { Token } from "./types";
import { KEYWORDS } from "./constants";

export class Lexer {
	private input: string;
	private pos: number = 0;
	private tokens: Token[] = [];

	// Palabras reservadas
	private keywords = [...KEYWORDS];
	
	constructor(input: string) {
		this.input = input;
	}
	
	// Generar tokens
	tokenize(): Token[] {
		while (this.pos < this.input.length) {
			const char = this.input[this.pos];
			const nextChar = this.input[this.pos + 1];
			
			// Ignorar espacios y saltos de línea
			if (/\s/.test(char)) {
				this.pos++;
				continue;
			}
			
			// Comentarios
			else if (char === "/" && nextChar === "/") {
				this.skipComment();
				continue;
			}
			
			// Strings
			else if (char === '"') {
				this.tokens.push(this.readString());
				continue;
			}
			
			// Números
			else if (/[0-9]/.test(char)) {
				this.tokens.push(this.readNumber());
				continue;
			}
			
			// Palabras clave, identificadores y booleanos
			else if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(char)) {
				this.tokens.push(this.readWord());
				continue;
			}
			
			// Asignación (<-)
			else if (char === "<" && nextChar === "-") {
				this.pos += 2;
				this.tokens.push({ type: "ASSIGNMENT", value: "<-" });
				continue;
			}
			
			// Operadores
			else if ("+-*/<>=:&|".includes(char)) {
				this.tokens.push({ type: "OPERATOR", value: char });
				this.pos++;
				continue;
			}
			
			// Paréntesis
			else if (char === "(") {
				this.tokens.push({ type: "PAREN_LEFT", value: char });
				this.pos++;
				continue;
			}
			
			else if (char === ")") {
				this.tokens.push({ type: "PAREN_RIGHT", value: char });
				this.pos++;
				continue;
			}
			
			// Corchetes
			else if (char === "[") {
				this.tokens.push({ type: "BRACKET_LEFT", value: char });
				this.pos++;
				continue;
			}
			
			else if (char === "]") {
				this.tokens.push({ type: "BRACKET_RIGHT", value: char });
				this.pos++;
				continue;
			}
			
			// Comas
			else if (char === ",") {
				this.tokens.push({ type: "COMMA", value: char });
				this.pos++;
				continue;
			}
			
			// Error de carácter inesperado
			throw new Error(`Carácter inesperado '${char}', en posición: ${this.pos}`);
		}
		
		return this.tokens;
	}
	
	// Leer cadenas de texto
	private readString(): Token {
		let end = this.pos + 1;
		while (end < this.input.length && this.input[end] !== '"') end++;
		
		if (this.input[end] !== '"') {
			throw new Error(`Cadena no cerrada. Faltan comillas en la posición ${this.pos}`);
		}
		
		const value = this.input.slice(this.pos + 1, end);
		this.pos = end + 1;
		
		return { type: "STRING", value };
	}
	
	// Leer palabras (identificadores, keywords o booleanos)
	private readWord(): Token {
		let end = this.pos + 1;
		while (
			 end < this.input.length &&
			 /[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/.test(this.input[end])
		) {
			 end++;
		}
		
		const value = this.input.slice(this.pos, end);
		this.pos = end;
		
		const lowerValue = value.toLowerCase();
		
		if (lowerValue === "verdadero" || lowerValue === "falso") {
			 return { type: "BOOLEAN", value };
		}
		
		else if (this.keywords.some(keyword => keyword.toLowerCase() === lowerValue)) {
			 return { type: "KEYWORD", value };
		}
		
		return { type: "IDENTIFIER", value };
  }
	
	// Leer números
	private readNumber(): Token {
		let end = this.pos + 1;
		while (end < this.input.length && /[0-9]/.test(this.input[end])) end++;
		
		const value = this.input.slice(this.pos, end);
		this.pos = end;
		
		return { type: "NUMBER", value };
	}
	
	// Saltar comentarios
	private skipComment() {
		while (this.pos < this.input.length && this.input[this.pos] !== "\n") {
			this.pos++;
		}
	}
}