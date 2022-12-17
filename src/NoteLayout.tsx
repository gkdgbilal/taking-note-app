import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "./App"

type NoteLayoutProps = {
    notes: Note[]
}

export function NoteLayout({ notes }: NoteLayoutProps) {
    const { id } = useParams()
    const note = notes.find(note => note.id === id)

    if (!note) {
        return <Navigate to="/" replace />
    }

    return <Outlet context={note} />
}

export function useNote() {
    return useOutletContext<Note>()
}