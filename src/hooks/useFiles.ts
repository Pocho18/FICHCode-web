import { fileStore } from "@/contexts/fileStore"
import { ChangeEvent } from "react"
import { useStore } from "zustand"

export default function useFiles(){
	const { addFile, setOpenFiles, setActiveFile, activeFile, getFileInfo } = useStore(fileStore)
	
	// ---------------------------- CREAR ARCHIVO ----------------------------
	const handleCreateFile = () => {
		const fileId = addFile({
			name: "Nuevo.psc",
			content: `Algoritmo\n    // Tu codigo aqui\nFinAlgoritmo      
	`,
			createdAt: new Date().toDateString(),
			updatedAt: new Date().toDateString()
		})
		
		// Asegurarse de que el archivo recién creado esté en la lista de abiertos
		setOpenFiles(fileId)
	}
	
	// ---------------------- SUBIR ARCHIVO ----------------------------
	const handleOpenFile = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return
		const filesUp = Array.from(e.target.files)
		
		try {
			const contents = await Promise.all(
				filesUp.map(async (file) => {
					const content = await readFileAsText(file)
					return {
						name: file.name,
						content,
						createdAt: new Date().toDateString(),
						updatedAt: new Date().toDateString()
					}
				})
			)
			
			const fileIds = contents.map(file => {
				const fileId = addFile({...file})
				setOpenFiles(fileId)
				return fileId
			})
			
			// Asegurarnos de que el último archivo subido se active
			if (fileIds.length > 0) {
				setActiveFile(fileIds[fileIds.length - 1])
			}
		} catch (err) {
			console.error("Error al subir uno o más archivos: ", err)
		}
	}
	
	const readFileAsText = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			
			reader.onerror = () => reject(reader.error)
			reader.onload = (evt) => {
				if (!evt.target?.result) {
					reject("Archivo vacío");
					return;
				}
				resolve(evt.target.result as string)
			}
			
			reader.readAsText(file, "UTF8")
		})
	}

	// ---------------------- DUPLICAR ARCHIVO ----------------------------
	const handleDuplicateFile = ()=>{
		const fileInfo = getFileInfo(activeFile)
		if (!fileInfo) return
		addFile({...fileInfo, createdAt: new Date().toDateString(), updatedAt: new Date().toDateString()})
	}
	
	return { handleCreateFile, handleOpenFile, handleDuplicateFile }
}