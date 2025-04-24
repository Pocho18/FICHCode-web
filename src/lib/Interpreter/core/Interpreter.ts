import readlineSync from 'readline-sync'
import { StatementNode, ExpressionNode, ProgramNode } from "./types"
import { PREDEFINED_VALUES, PREDEFINED_FUNCTIONS } from './constants'

/**
* Intérprete del lenguaje personalizado
*/
export class Interpreter {
	private variables: Record<string, any> = { ...PREDEFINED_VALUES };
	private functions: Record<string, Function> = { ...PREDEFINED_FUNCTIONS };
		
	constructor() {}
	
	/**
	* Ejecuta el programa recorriendo su cuerpo (AST)
	*/
	run(program: ProgramNode) {
		for (const statement of program.body) {
			this.execute(statement)
		}
	}
	
	/**
	* Ejecuta una instrucción individual (Statement)
	*/
	private execute(node: StatementNode): any {
		switch (node.type) {
			case "Assignment": {
				const value = this.evaluate(node.value)
				this.variables[node.identifier] = value
				break
			}
			
			case "ArrayStatement": {
				const size = this.evaluate(node.size)
				if (node.identifier in this.variables) {
					throw new Error("Nombre de variable existente. Pruebe usar otro.")
				}
				this.variables[node.identifier] = new Array(size).fill(undefined)
				break
			}
			
			case "ArrayAssignment": {
				if (!(node.identifier in this.variables)) {
					throw new Error("La variable no existe. Declárela.")
				}
				const index = this.evaluate(node.index)
				const arr = this.variables[node.identifier] as Array<any>
				if (index < 1 || index > arr.length) {
					throw new Error("Índice fuera de rango.")
				}
				arr[index - 1] = this.evaluate(node.value)
				break
			}
			
			case "PrintStatement": {
				for (const expr of node.expression) {
					const value = this.evaluate(expr)
					process.stdout.write(String(value))
				}
				process.stdout.write('\n')
				break
			}
			
			case "ReadStatement": {
				for (const expr of node.expression) {
					const name = (expr as any).name
					const inputValue = readlineSync.question(">")
					this.variables[name] = isNaN(Number(inputValue)) ? inputValue : Number(inputValue)
				}
				break
			}
			
			case "IfStatement": {
				const conditionResult = this.evaluate(node.condition)
				const branch = conditionResult ? node.thenBranch : node.elseBranch
				if (branch) {
					for (const stmt of branch) {
						this.execute(stmt)
					}
				}
				break
			}
			
			case "SwitchStatement": {
				const value = this.evaluate(node.analize)
				let matched = false
				for (let i = 0; i < node.conditions.length; i++) {
					if (this.evaluate(node.conditions[i]) === value) {
						matched = true
						for (const stmt of node.caseBranch[i]) {
							this.execute(stmt)
						}
						break
					}
				}
				if (!matched && node.defaultBranch.length > 0) {
					for (const stmt of node.defaultBranch) {
						this.execute(stmt)
					}
				}
				break
			}
			
			case "WhileStatement": {
				while (this.evaluate(node.condition)) {
					for (const stmt of node.body) {
						this.execute(stmt)
					}
				}
				break
			}
			
			case "DoWhileStatement": {
				do {
					for (const stmt of node.body) {
						this.execute(stmt)
					}
				} while (!this.evaluate(node.condition))
					break
			}
			
			case "ForStatement": {
				for (let i = node.value; i <= node.endValue; i += node.step) {
					this.variables[node.identifier] = i
					for (const stmt of node.body) {
						this.execute(stmt)
					}
				}
				break
			}
			
			default: 
			throw new Error(`Instrucción no soportada: ${(node as any).type}`)
		}
	}
	
	/**
	* Evalúa una expresión y devuelve su valor
	*/
	private evaluate(node: ExpressionNode): any {
		switch (node.type) {
			case "StringLiteral":
			case "NumberLiteral":
			case "BooleanLiteral":
				return node.value
			
			case "ArrayAccess": {
				if (!(node.identifier in this.variables)) {
					throw new Error("Variable no definida.")
				}
				const index = this.evaluate(node.index)
				const arr = this.variables[node.identifier]
				if (index < 1 || index > arr.length) {
					throw new Error("Índice fuera de rango.")
				}
				return arr[index - 1]
			}
			
			case "Identifier": {
				if (node.name in this.variables) {
					return this.variables[node.name]
				}
				throw new Error(`Variable no definida: ${node.name}`)
			}
			
			case "BinaryExpression": {
				const left = this.evaluate(node.left)
				const right = this.evaluate(node.right)
				switch (node.operator) {
					case '+': return left + right
					case '-': return left - right
					case '*': return left * right
					case '/': return left / right
					case '>': return left > right
					case '<': return left < right
					case '>=': return left >= right
					case '<=': return left <= right
					case '=': return left === right
					case '&': return Boolean(left) && Boolean(right)
					case '|': return Boolean(left) || Boolean(right)
					default:
						throw new Error(`Operador no soportado: ${node.operator}`)
				}
			}
			
			case "FunctionCall": {
				if (node.identifier in this.functions) {
					const func = this.functions[node.identifier]
					
					if (node.args.length > 0) return func(this.evaluate(node.args[0]))
					else return func()
				} else {
					throw new Error(`Función no definida: ${node.identifier}`)
				} 
		  	}
			
			default:
				throw new Error(`Expresión no soportada: ${(node as any).type}`)
		}
	}
}