// ---------------------------
//        LEXER TYPES
// ---------------------------

/**
* Tipos de tokens válidos en el lenguaje.
*/
export type TokenType =
| "KEYWORD"
| "IDENTIFIER"
| "OPERATOR"
| "STRING"
| "NUMBER"
| "BOOLEAN"
| "PAREN_LEFT"
| "PAREN_RIGHT"
| "BRACKET_LEFT"
| "BRACKET_RIGHT"
| "ASSIGNMENT"
| "COMMA"

/**
* Estructura de un token léxico.
*/
export type Token = {
	type: TokenType
	value: string
}

// ---------------------------
//         AST NODES
// ---------------------------

/**
* Nodo raíz del programa.
*/
export type ProgramNode = {
	type: "Program"
	body: StatementNode[]
}

// ---------------------------
//    LITERALES Y EXPRESIONES
// ---------------------------

/**
* Literal de tipo string, por ejemplo: "Hola"
*/
export type StringLiteralNode = {
	type: "StringLiteral"
	value: string
}

/**
* Literal de tipo número, por ejemplo: 42
*/
export type NumberLiteralNode = {
	type: "NumberLiteral"
	value: number
}

/**
* Literal de tipo booleano: verdadero o falso
*/
export type BooleanLiteralNode = {
	type: "BooleanLiteral"
	value: boolean
}

/**
* Representa una variable identificada por nombre.
*/
export type IdentifierNode = {
	type: "Identifier"
	name: string
}

/**
* Expresión binaria como suma, resta, comparación, etc.
*/
export type BinaryExpressionNode = {
	type: "BinaryExpression"
	operator: string
	left: ExpressionNode
	right: ExpressionNode
}

/**
* Acceso a un índice específico de un array.
* Ejemplo: arr[2]
*/
export type ArrayAccessNode = {
	type: "ArrayAccess"
	identifier: string
	index: ExpressionNode
}

/**
* Llamda a una función.
* Ejemplo: sqrt(a)
*/
export type FunctionCallNode = {
	type: "FunctionCall"
	identifier: string
	args: ExpressionNode[]
}

/**
* Unión de todos los tipos de expresiones posibles.
*/
export type ExpressionNode =
	| StringLiteralNode
	| NumberLiteralNode
	| BooleanLiteralNode
	| IdentifierNode
	| BinaryExpressionNode
	| ArrayAccessNode
	| FunctionCallNode
	
// ---------------------------
//         STATEMENTS
// ---------------------------

/**
* Escribir uno o más valores en consola.
* Ejemplo: Escribir "Hola", a
*/
export type PrintStatementNode = {
	type: "PrintStatement"
	expression: ExpressionNode[]
}

/**
* Leer valores desde la entrada del usuario.
* Ejemplo: Leer a, b
*/
export type ReadStatementNode = {
	type: "ReadStatement"
	expression: ExpressionNode[]
}

/**
* Asignación de valor a una variable.
* Ejemplo: a <- 5
*/
export type AssignmentNode = {
	type: "Assignment"
	identifier: string
	value: ExpressionNode
}

/**
* Declaración de un array con tamaño fijo.
* Ejemplo: Dimension arr[10]
*/
export type ArrayStatementNode = {
	type: "ArrayStatement"
	identifier: string
	size: ExpressionNode
}

/**
* Asignación de valor a un índice específico de un array.
* Ejemplo: arr[2] <- 10
*/
export type ArrayAssignmentNode = {
	type: "ArrayAssignment"
	identifier: string
	index: ExpressionNode
	value: ExpressionNode
}

/**
* Declaración de un array con tamaño fijo.
* Variante con tamaño como número.
*/
export type ArrayDeclarationNode = {
	type: "ArrayStatement"
	identifier: string
	size: number
}

/**
* Condicional SI/SINO clásico.
*/
export type IfStatementNode = {
	type: "IfStatement"
	condition: ExpressionNode
	thenBranch: StatementNode[]
	elseBranch?: StatementNode[]
}

/**
* Condicional tipo switch (SEGUN).
*/
export type SwitchStatementNode = {
	type: "SwitchStatement"
	analize: ExpressionNode
	conditions: ExpressionNode[]
	caseBranch: StatementNode[][]
	defaultBranch: StatementNode[]
}

/**
* Bucle WHILE: mientras la condición sea verdadera.
*/
export type WhileStatementNode = {
	type: "WhileStatement"
	condition: ExpressionNode
	body: StatementNode[]
}

/**
* Bucle REPETIR-HASTA.
*/
export type DoWhileStatementNode = {
	type: "DoWhileStatement"
	condition: ExpressionNode
	body: StatementNode[]
}

/**
* Bucle PARA con contador, fin e incremento.
*/
export type ForStatementNode = {
	type: "ForStatement"
	identifier: string
	value: number
	endValue: number
	step: number
	body: StatementNode[]
}

/**
* Unión de todos los tipos de sentencias válidas.
*/
export type StatementNode =
	| PrintStatementNode
	| ReadStatementNode
	| AssignmentNode
	| ArrayAssignmentNode
	| ArrayStatementNode
	| IfStatementNode
	| SwitchStatementNode
	| WhileStatementNode
	| DoWhileStatementNode
	| ForStatementNode