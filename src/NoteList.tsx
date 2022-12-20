import { useState, useMemo } from 'react'
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Note, Tag } from './App'
import styles from './NoteList.module.css'

type SimplifiedNote = {
    id: string
    title: string
    tags: Tag[]
}

type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onUpdateTag: (id: string, label: string) => void
    onDeleteTag: (id: string) => void
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
        <Card.Body>
            <Stack gap={2} className="align-items-center justify-content-center h-100">
                <span className='fs-5'>{title}</span>
                {
                    tags.length > 0 &&
                    <Stack gap={1} direction="horizontal"
                        className="flex-wrap justify-content-center"
                    >
                        {
                            tags.map(tag => (
                                <Badge key={tag.id} className='text-truncate'>
                                    {tag.label}
                                </Badge>
                            ))
                        }
                    </Stack>
                }
            </Stack>
        </Card.Body>
    </Card>
}

function EditTagsModal({ availableTags, show, handleClose, onUpdateTag, onDeleteTag }: EditTagsModalProps) {
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {
                        availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control
                                        type='text'
                                        value={tag.label}
                                        onChange={e => onUpdateTag(tag.id, e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant='outline-danger'
                                        onClick={() => onDeleteTag(tag.id)}
                                    >
                                        &times;
                                    </Button>
                                </Col>
                            </Row>
                        ))
                    }
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}

const NoteList = ({ availableTags, notes, onDeleteTag, onUpdateTag }: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState<string>('')
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState<boolean>(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title == "" || note.title.toLowerCase().includes(title.toLowerCase()))
                && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
        })
    }, [notes, selectedTags, title])

    return (
        <>
            <Row className='align-items-center mb-4'>
                <Col><h1>Notes</h1></Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant='primary'>Create</Button>
                        </Link>
                        <Button variant='outline-secondary'
                            onClick={() => setEditTagsModalIsOpen(true)}
                        >Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className='mb-4'>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                value={selectedTags.map(tag => {
                                    return { value: tag.id, label: tag.label }
                                })}
                                options={availableTags.map(tag => {
                                    return { value: tag.id, label: tag.label }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { id: tag.value, label: tag.label }
                                    }))
                                }}
                                isMulti
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {
                    filteredNotes.map(note => (
                        <Col key={note.id}>
                            <NoteCard
                                id={note.id}
                                title={note.title}
                                tags={note.tags}
                            />
                        </Col>
                    ))
                }
            </Row>
            <EditTagsModal
                show={editTagsModalIsOpen}
                availableTags={availableTags}
                handleClose={() => setEditTagsModalIsOpen(false)}
                onUpdateTag={onUpdateTag}
                onDeleteTag={onDeleteTag}
            />
        </>
    )
}

export default NoteList