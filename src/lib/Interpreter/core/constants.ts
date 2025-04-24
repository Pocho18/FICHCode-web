/**
 * Palabras clave reservadas del lenguaje
 */
export const KEYWORDS = [
    "algoritmo", "finalgoritmo", "escribir", "leer", "dimension",
    "si", "finsi", "sino", "entonces",
    "segun", "de", "otro", "modo", "finsegun", "caso",
    "mientras", "hacer", "finmientras",
    "repetir", "hasta", "que",
    "para", "con", "paso", "finpara",

    // Valores booleanos
    "verdadero", "falso",
    
];

/**
 * Nombres de funciones matemáticas disponibles
 */
export const MATH_FUNCTIONS = [
    // Funciones matemáticas básicas
    "sqrt", "raiz", // Raíz cuadrada
    "sin", "sen",   // Seno (versiones en inglés y español)
    "cos",          // Coseno
    "tan",          // Tangente
    "abs",          // Valor absoluto
    "log",          // Logaritmo
    "ln",           // Logaritmo natural
    "exp",          // Exponencial
    
    // Funciones de redondeo
    "round",        // Redondeo
    "trunc",        // Truncamiento
    "floor",        // Redondeo hacia abajo
    "ceil",         // Redondeo hacia arriba
    
    // Funciones adicionales
    "aleatorio",    // Número aleatorio
    "azar",         // Sinónimo de aleatorio
    "longitud",     // Longitud de una cadena o array
    "concatenar",   // Concatenar strings
    "subcadena",    // Substring
    
    // Conversiones
    "convertiranumero",
    "convertiratexto"
];

/**
 * Valores predefinidos para el intérprete
 */
export const PREDEFINED_VALUES: Record<string, any> = {
    'PI': Math.PI,
    'E': Math.E
};

/**
 * Funciones matemáticas predefinidas para el intérprete
 */
export const PREDEFINED_FUNCTIONS: Record<string, Function> = {
    // Funciones matemáticas básicas
    'sqrt': Math.sqrt,
    'raiz': Math.sqrt,
    'sin': Math.sin,
    'sen': Math.sin,
    'cos': Math.cos,
    'tan': Math.tan,
    'abs': Math.abs,
    'log': Math.log10,
    'ln': Math.log,
    'exp': Math.exp,
    
    // Funciones de redondeo
    'round': Math.round,
    'trunc': Math.trunc,
    'floor': Math.floor,
    'ceil': Math.ceil,
    
    // Funciones adicionales
    'aleatorio': (min = 0, max = 1) => min + Math.random() * (max - min),
    'azar': (max = 100) => Math.floor(Math.random() * max) + 1,
    'longitud': (valor: string | any[]) => valor.length,
    'concatenar': (a: string, b: string) => a + b,
    'subcadena': (texto: string, inicio: number, fin: number) => texto.substring(inicio - 1, fin),
    
    // Conversiones
    'convertiranumero': (valor: any) => Number(valor),
    'convertiratexto': (valor: any) => String(valor)
};