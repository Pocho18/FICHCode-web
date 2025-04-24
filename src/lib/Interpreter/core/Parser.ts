import { KEYWORDS, PREDEFINED_VALUES } from './constants'
import {
	TokenType,
	Token,
	StatementNode,
	ExpressionNode,
	ProgramNode,
} from './types'

// Clase principal del parser
export class Parser {
	private tokens: Token[]
	private pos = 0
	
	constructor(tokens: Token[]) {
		this.tokens = tokens
	}
	
	// -------------------- PUNTO DE ENTRADA --------------------
	
	parse(): ProgramNode {
		this.expect("KEYWORD", "algoritmo")
		if (!this.match("IDENTIFIER")) {
			throw new Error(`El programa debe tener un nombre. Colocalo después de 'algoritmo'`)
		}
		
		const body: StatementNode[] = []
		while (!this.check("KEYWORD", "finalgoritmo")) {
			body.push(this.parseStatement())
		}
		
		this.expect("KEYWORD", "finalgoritmo")
		return { type: "Program", body }
	}
	
	// -------------------- PARSEO DE INSTRUCCIONES --------------------
	
	private parseStatement(): StatementNode {
		const token = this.peek()
		
		if (this.match("KEYWORD", "escribir")) {
			const expressions: ExpressionNode[] = [this.parseExpression()]
			while (this.match("COMMA")) expressions.push(this.parseExpression())
				return { type: "PrintStatement", expression: expressions }
		}
		
		if (this.match("KEYWORD", "leer")) {
			const identifiers: ExpressionNode[] = [this.parseIdentifier()]
			while (this.match("COMMA")) identifiers.push(this.parseIdentifier())
				return { type: "ReadStatement", expression: identifiers }
		}
		
		if (this.match("KEYWORD", "si")) {
			return this.parseIfStatement()
		}
		
		if (this.match("KEYWORD", "segun")) {
			return this.parseSwitchStatement()
		}
		
		if (this.match("KEYWORD", "mientras")) {
			return this.parseWhileStatement()
		}
		
		if (this.match("KEYWORD", "repetir")) {
			return this.parseDoWhileStatement()
		}
		
		if (this.match("KEYWORD", "para")) {
			return this.parseForStatement()
		}
		
		if (this.match("KEYWORD", "dimension")) {
			return this.parseArrayStatement()
		}
		
		if (token.type === "IDENTIFIER") {
			const identifier = this.consume().value
			let index: ExpressionNode | null = null
			
			if (this.match("BRACKET_LEFT", "[")) {
				index = this.parseExpression()
				this.expect("BRACKET_RIGHT", "]")
			}
			
			if (this.match("ASSIGNMENT", "<-")) {
				if (identifier in PREDEFINED_VALUES) throw new Error(`Nombre de variable no válido, pruebe utilizar otro. Recibido: ${identifier}`)
				const value = this.parseExpression()
				
				if (index) return { type: "ArrayAssignment", identifier, index, value }
				return { type: "Assignment", identifier, value }
			}
			
			throw new Error(`Instrucción inválida luego de '${identifier}'. Recibido: ${token.value}`)
		}
		
		throw new Error(`Instrucción inválida. Recibido: ${token.value}`)
	}
	
	// -------------------- EXPRESIONES Y VALORES --------------------
	
	private parseExpression(): ExpressionNode {
		let left = this.parsePrimary()
		
		while (this.checkOperator() && this.peek().value != ":") {
			const operator = this.consume().value
			const right = this.parsePrimary()
			left = { type: "BinaryExpression", left, operator, right }
		}
		
		return left
	}
	
	private parsePrimary(): ExpressionNode {
		const token = this.peek();
		
		if (this.match("STRING")) return { type: "StringLiteral", value: token.value };
		if (this.match("NUMBER")) return { type: "NumberLiteral", value: Number(token.value) };
		if (this.match("BOOLEAN")) return { type: "BooleanLiteral", value: token.value === "verdadero" };
		if (token.value in PREDEFINED_VALUES) {
			this.consume()
			return { type: "NumberLiteral", value: PREDEFINED_VALUES[token.value] }
		}
		
		if (this.match("IDENTIFIER")) {
			const identifier = token.value;
			
			if (this.check("PAREN_LEFT")) {
				this.consume(); 
				const args: ExpressionNode[] = [];
				
				if (!this.check("PAREN_RIGHT")) {
					args.push(this.parseExpression());
					while (this.match("COMMA")) {
						args.push(this.parseExpression());
					}
				}
				
				this.expect("PAREN_RIGHT", ")");
				return { type: "FunctionCall", identifier, args: args };
			}
			
			if (this.match("BRACKET_LEFT", "[")) {
				const index = this.parseExpression();
				this.expect("BRACKET_RIGHT", "]");
				return { type: "ArrayAccess", identifier, index };
			}
			
			return { type: "Identifier", name: identifier };
		}
		
		throw new Error(`Expresión no válida: ${token.value}`);
	}
	private parseIdentifier(): ExpressionNode {
		const token = this.peek()
		if (token.type === "IDENTIFIER" && KEYWORDS.includes(token.value)) {
			throw new Error("Nombre de variable no válido. Pruebe usar otro.")
		}

		if (token.type === "IDENTIFIER") {
			this.consume()
			return { type: "Identifier", name: token.value }
		}
		throw new Error(`Identificador no válido. Recibido: ${token.value}`)
	}
	
	private parseNumber(): number {
		const token = this.peek()
		const num = Number(token.value)
		if (!num) throw new Error(`Se esperaba un número, pero se recibió: ${token.value}`)
			this.consume()
		return num
	}
	
	private checkOperator(): boolean {
		const token = this.peek()
		return token.type === "OPERATOR"
	}
	
	// -------------------- CONDICIONALES --------------------
	
	private parseIfStatement(): StatementNode {
		const condition = this.parseExpression()
		this.expect("KEYWORD", "entonces")
		
		const thenBranch: StatementNode[] = []
		while (!this.check("KEYWORD", "sino") && !this.check("KEYWORD", "finsi")) {
			thenBranch.push(this.parseStatement())
		}
		
		let elseBranch: StatementNode[] | null = null
		if (this.match("KEYWORD", "sino")) {
			elseBranch = []
			while (!this.check("KEYWORD", "finsi")) {
				elseBranch.push(this.parseStatement())
			}
		}
		
		this.expect("KEYWORD", "finsi")
		return { type: "IfStatement", condition, thenBranch, elseBranch }
	}
	
	private parseSwitchStatement(): StatementNode {
		const analize = this.parseIdentifier()
		this.expect("KEYWORD", "hacer")
		
		const conditions: ExpressionNode[] = []
		const caseBranch: StatementNode[][] = []
		let defaultBranch: StatementNode[] = []
		
		while (!this.check("KEYWORD", "de") && !this.check("KEYWORD", "finsegun")) {
			this.expect("KEYWORD", "caso")
			conditions.push(this.parseExpression())
			this.expect("OPERATOR", ":")
			
			const statements: StatementNode[] = []
			while (!this.check("KEYWORD", "caso") && !this.check("KEYWORD", "de") && !this.check("KEYWORD", "finsegun")) {
				statements.push(this.parseStatement())
			}
			caseBranch.push(statements)
		}
		
		if (this.match("KEYWORD", "de")) {
			this.expect("KEYWORD", "otro")
			this.expect("KEYWORD", "modo")
			this.expect("OPERATOR", ":")
			
			while (!this.check("KEYWORD", "finsegun")) {
				defaultBranch.push(this.parseStatement())
			}
		}
		
		this.expect("KEYWORD", "finsegun")
		return { type: "SwitchStatement", conditions, caseBranch, defaultBranch, analize }
	}
	
	// -------------------- BUCLES --------------------
	
	private parseWhileStatement(): StatementNode {
		const condition = this.parseExpression()
		this.expect("KEYWORD", "hacer")
		
		const body: StatementNode[] = []
		while (!this.check("KEYWORD", "finmientras")) {
			body.push(this.parseStatement())
		}
		
		this.expect("KEYWORD", "finmientras")
		return { type: "WhileStatement", condition, body }
	}
	
	private parseDoWhileStatement(): StatementNode {
		const body: StatementNode[] = []
		while (!this.check("KEYWORD", "hasta")) {
			body.push(this.parseStatement())
		}
		
		this.expect("KEYWORD", "hasta")
		this.expect("KEYWORD", "que")
		const condition = this.parseExpression()
		
		return { type: "DoWhileStatement", condition, body }
	}
	
	private parseForStatement(): StatementNode {
		const identifier = this.peek().value
		if (!this.match("IDENTIFIER")) {
			throw new Error(`Se esperaba una variable, pero se recibió: '${this.peek().type}'`)
		}
		
		this.expect("ASSIGNMENT", "<-")
		const value = this.parseNumber()
		this.expect("KEYWORD", "hasta")
		const endValue = this.parseNumber()
		
		let step = 1
		if (this.match("KEYWORD", "con")) {
			this.expect("KEYWORD", "paso")
			step = this.parseNumber()
		}
		
		this.expect("KEYWORD", "hacer")
		const body: StatementNode[] = []
		while (!this.check("KEYWORD", "finpara")) {
			body.push(this.parseStatement())
		}
		
		this.expect("KEYWORD", "finpara")
		return { type: "ForStatement", identifier, value, endValue, body, step }
	}
	
	// -------------------- ARRAYS --------------------
	
	private parseArrayStatement(): StatementNode {
		const id = this.consume().value
		this.expect("BRACKET_LEFT", "[")
		const size = this.parseExpression()
		this.expect("BRACKET_RIGHT", "]")
		
		return { type: "ArrayStatement", identifier: id, size }
	}
	
	// -------------------- UTILS --------------------
	
	private peek(): Token {
		return this.tokens[this.pos]
	}
	
	private consume(): Token {
		const current = this.tokens[this.pos]
		this.pos++
		return current
	}
	
	private match(type: TokenType, value?: string): boolean {
		const token = this.peek()
		if (!token || token.type !== type) return false
		if (value !== undefined && token.value.toLowerCase() !== value.toLowerCase()) return false
		this.consume()
		return true
	}
	
	private check(type: TokenType, value?: string): boolean {
		const token = this.peek()
		if (!token || token.type !== type) return false
		if (value !== undefined && token.value.toLowerCase() !== value.toLowerCase()) return false
		return true
	}
	
	private expect(type: TokenType, value: string): Token {
		if (!this.check(type, value)) {
			throw new Error(`Esperaba token tipo '${type}' con valor '${value}', pero recibió '${this.peek().value}'`)
		}
		return this.consume()
	}
}