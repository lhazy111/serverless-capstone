import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Image,
  Loader,
  Form,
} from 'semantic-ui-react'

import { createNote, deleteNote, getNotes, patchNote } from '../api/notes-api'
import Auth from '../auth/Auth'
import { Note } from '../types/Note'

interface NotesProps {
  auth: Auth
  history: History
}

interface NotesState {
  notes: Note[]
  newNoteContent: string
  loadingNotes: boolean
}

export class Notes extends React.PureComponent<NotesProps, NotesState> {
  state: NotesState = {
    notes: [],
    newNoteContent: '',
    loadingNotes: true
  }

  handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newNoteContent: event.target.value })
  }

  onUploadButtonClick = (noteId: string) => {
    this.props.history.push(`/notes/${noteId}/edit`)
  }

  onEditButtonClick = async (pos: number) => {
    try {
      const note = this.state.notes[pos]
      await patchNote(this.props.auth.getIdToken(), note.noteId, {
        content: note.content,
        createdDate: note.createdDate,
        attachment: note.attachment
      })
    } catch {
      alert('Note update failed')
    }

  }


  onNoteCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      const createdDate = this.creationDate()
      console.log('New note:', createdDate, this.state.newNoteContent)
      const newNote = await createNote(this.props.auth.getIdToken(), {
        content: this.state.newNoteContent,
        createdDate,
        attachment: false

      })
      this.setState({
        notes: [...this.state.notes, newNote],
        newNoteContent: ''
      })
    } catch {
      alert('Note creation failed')
    }
  }

  onNoteDelete = async (noteId: string) => {
    try {
      await deleteNote(this.props.auth.getIdToken(), noteId)
      this.setState({
        notes: this.state.notes.filter(note => note.noteId !== noteId)
      })
    } catch {
      alert('Note deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const notes = await getNotes(this.props.auth.getIdToken())
      this.setState({
        notes,
        loadingNotes: false
      })
    } catch (e) {
      alert(`Failed to fetch notes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>

        {this.renderCreateNoteInput()}

        {this.renderNotes()}
      </div>
    )
  }

  renderCreateNoteInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Form onSubmit={this.onNoteCreate}>
            <Form.TextArea
              rows={5}
              placeholder="Type here"
              onChange={this.handleContentChange}
            />
            <Form.Button
              color="grey"
              type='submit'
            >Submit</Form.Button>
          </Form>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderNotes() {
    if (this.state.loadingNotes) {
      return this.renderLoading()
    }

    return this.renderNotesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading notes
        </Loader>
      </Grid.Row>
    )
  }

  renderNotesList() {
    return (
      <Grid padded="horizontally">
        {this.state.notes.map((note, pos) => {
          return (

            <Grid.Row key={note.noteId}>
              <Grid.Column width={16}>
                {note.attachmentUrl && (
                  <Image src={note.attachmentUrl} onError={(i: { target: { style: { display: string } } }) => { i.target.style.display = 'none' }} centered />
                )}
              </Grid.Column>
              <Grid.Column width={6} verticalAlign="middle">
                {note.content}
              </Grid.Column>
              <Grid.Column width={4}>
                {note.createdDate}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                <Button.Group
                  color="grey"
                  size='small'>
                  <Button icon='upload' onClick={() => this.onUploadButtonClick(note.noteId)} />
                  <Button icon='delete' onClick={() => this.onNoteDelete(note.noteId)} />
                </Button.Group>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  creationDate(): string {
    const date = new Date()
    date.setDate(date.getDate())
    return dateFormat(date) as string
  }
}
