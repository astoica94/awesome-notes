import React, { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import reject from 'lodash/reject';

import './i18n';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const priorityIconMap = {
  0: ExpandMoreIcon,
  1: ExpandLessIcon,
  2: PriorityHighIcon,
};

const priorityIconTestIdMap = {
  0: 'NOTE_ITEM_PRIORITY_MINOR_ICON',
  1: 'NOTE_ITEM_PRIORITY_MAJOR_ICON',
  2: 'NOTE_ITEM_PRIORITY_BLOCKER_ICON',
};

function App() {
  const classes = useStyles();

  const [priority, setPriority] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const noteIdToDelete = useRef(null);

  const [notes, setNotes] = useState([
    { id: uuid(), priority: 0, text: 'Pay electricity bills' },
    { id: uuid(), priority: 1, text: 'Order food from local grocery store' },
    { id: uuid(), priority: 2, text: 'Buy Christmas gifts for my family' },
    { id: uuid(), priority: 2, text: 'Call my mother one a day' },
    { id: uuid(), priority: 2, text: 'Finish university project to receive a good grade' },
  ]);

  const { t } = useTranslation();

  const priorityTextMap = {
    0: t('MINOR'),
    1: t('MAJOR'),
    2: t('BLOCKER'),
  };

  function onSelectChange(e) {
    setPriority(e.target.value);
  }

  function onInputChange(e) {
    setInputValue(e.target.value);

    setHasError(false);
  }

  function onAddNoteClick() {
    const noteText = inputValue.trim();

    if (!noteText) {
      setHasError(true);
      return;
    }

    setNotes(prevState => [...prevState, { id: uuid(), priority, text: inputValue }]);

    setInputValue('');
  }

  function onDeleteNoteClick(noteId) {
    setIsDeleteConfirmationOpen(true);
    noteIdToDelete.current = noteId;
  }

  function onDeleteConfirmationClose() {
    setIsDeleteConfirmationOpen(false);
    noteIdToDelete.current = undefined;
  }

  function onDeleteConfirm() {
    if (noteIdToDelete.current) {
      setNotes(prevState => reject(prevState, { id: noteIdToDelete.current }));
    }

    setIsDeleteConfirmationOpen(false);
    noteIdToDelete.current = undefined;
  }

  async function changeLanguage(language) {
    await i18n.changeLanguage(language);
  }

  return (
    <div data-test-id="APP_ROOT" className={classes.root}>

      <div data-test-id="SELECT_LANGUAGE" style={{ marginBottom: '16px', padding: '16px' }}>
        {t('SELECT_LANGUAGE')}:

        <div style={{ marginTop: '8px' }}>
          <Chip
            style={{ marginRight: '8px' }}
            label={t('ENGLISH')}
            onClick={() => changeLanguage('en')}
            clickable
            color={i18n.language === 'en' ? 'secondary' : undefined}
            data-test-id="SELECT_LANGUAGE_EN"
          />

          <Chip
            label={t('ROMANIAN')}
            onClick={() => changeLanguage('ro')}
            clickable
            color={i18n.language === 'ro' ? 'secondary' : undefined}
            data-test-id="SELECT_LANGUAGE_RO"
          />
        </div>
      </div>

      <List component="nav" data-test-id="NOTE_LIST">
        {notes.map(({ id, priority, text }) => {
          const PriorityIcon = priorityIconMap[priority];
          const priorityText = priorityTextMap[priority];
          const testId = priorityIconTestIdMap[priority];

          return (
            <React.Fragment key={id}>
              <ListItem data-test-id="NOTE_ITEM">
                <ListItemIcon  data-test-id="NOTE_ITEM_ICON_CONTAINER">
                  <PriorityIcon title={priorityText} data-test-id={testId} />
                </ListItemIcon>

                <ListItemText primary={text} data-test-id="NOTE_ITEM_TEXT" />

                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => onDeleteNoteClick(id)}
                    data-test-id="NOTE_ITEM_DELETE_ACTION"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>

      <div style={{ marginTop: '16px', padding: '16px' }}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">{t('PRIORITY')}</InputLabel>
          <Select
            value={priority}
            onChange={onSelectChange}
            data-test-id="ADD_NOTE_PRIORITY_SELECT"
          >
            <MenuItem value={0}>{t('MINOR')}</MenuItem>
            <MenuItem value={1}>{t('MAJOR')}</MenuItem>
            <MenuItem value={2}>{t('BLOCKER')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          required
          label={t('NEW_NOTE')}
          placeholder={t('PLEASE_WRITE_NEW_NOTE')}
          helperText={hasError ? t('NOTE_TEXT_IS_REQUIRED') : ''}
          fullWidth
          error={hasError}
          value={inputValue}
          onChange={onInputChange}
          data-test-id="ADD_NOTE_TEXT_INPUT"
          style={{ marginTop: '16px' }}
        />

        <Button
          variant="contained"
          color="primary"
          disabled={hasError}
          onClick={onAddNoteClick}
          data-test-id="ADD_NOTE_SAVE_BUTTON"
          style={{ marginTop: '16px' }}
        >
          {t('ADD_NOTE')}
        </Button>
      </div>

      {isDeleteConfirmationOpen && (
        <Dialog
          open
          onClose={onDeleteConfirmationClose}
          data-test-id="DELETE_NOTE_CONFIRMATION"
        >
          <DialogTitle>{t('DELETE_NOTE_CONFIRMATION')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('ARE_YOU_SURE_DELETE')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onDeleteConfirmationClose} data-test-id="DELETE_NOTE_CONFIRMATION_NO">
              {t('NO')}
            </Button>
            <Button onClick={onDeleteConfirm} color="primary" autoFocus data-test-id="DELETE_NOTE_CONFIRMATION_YES">
              {t('YES_DELETE')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default App;
