import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiHardDrive } from 'react-icons/fi';

import ExplorerRibbon from './components/Ribbon';
import ExplorerSidebar from './components/Sidebar';
import { selectDirectoryItems } from '../../redux/account/account.selectors';
import './Explorer.scss';
import { createNewDirectoryItem, renameDirectoryItems, unlinkDirectoryItems } from '../../redux/account/account.actions';
import { FcDocument } from 'react-icons/fc';

const rootDir = '_root';

const ItemIcon = ({ isDir }) => (
  isDir 
    ? <img src={process.env.PUBLIC_URL + '/icons/MiFolder.svg'} />
    : <FcDocument fill='white' />
);


const DirectoryView = ({
  items,
  selectedItems,
  driveIcon,
  onSelectItem,
  onDoubleClick,
  createMode,
  renameMode,
  onCreateItem,
  onRenameItem,
  onCancelRename
}) => {

  const [newName, updateNewName] = useState('');
  const inputRef = useRef(null);
  const sortItems = () => dirItems.sort((a, b) => a.name > b.name);
  const onDoneRename = (newName) => createMode ? onCreateItem(newName) : onRenameItem(newName);

  const dirItems = items
    .concat(createMode
      ? {
        id: '_new',
        name: newName,
        isDir: createMode === 'dir'
      } : []);

  useEffect(() => {
    if(createMode) {
      updateNewName(createMode === 'dir' ? 'New Folder' : 'New Document');
      inputRef.current.focus();

    } else if(renameMode) {
      updateNewName(dirItems.filter(item => item.id === selectedItems[0])[0].name);
      inputRef.current.focus();
    }
  }, [createMode, renameMode]);

  return (
    <Fragment>
      {
        dirItems.map((item, i) => (
          <div key={i}
            className={
              'Explorer-fs-item' + (
                selectedItems.includes(item.id)
                  ? ' Explorer-fs-item-selected'
                  : ''
              )
            }
            onClick={() => onSelectItem(item.id)}
            onDoubleClick={() => item.isDir ? onDoubleClick(item.id) : true}>

            <span>
              {
                driveIcon
                  ? <FiHardDrive />
                  : <ItemIcon isDir={item.isDir} />
              }
            </span>
            <span
              className={
                (item.id === '_new' || (selectedItems.includes(item.id) && renameMode))
                  ? 'Explorer-fs-item-hidden'
                  : ''
              }>
              {item.name}{item.extension ? '.' + item.extension : ''}
            </span>

            {
              (item.id === '_new' || (selectedItems.includes(item.id) && renameMode))
                && <input
                  type='text'
                  className='Explorer-fs-item-pseudo-name'
                  ref={inputRef}
                  value={newName}
                  onChange={e => updateNewName(e.target.value)}
                  onKeyUp={e => e.key === 'Enter' && onDoneRename(newName)}
                  onBlur={() => onCancelRename(item.name)} />
            }
          </div>
        ))
      }
    </Fragment>
  );
};


const Explorer = () => {

  const dispatch = useDispatch();
  const [currentDir, updateCurrentDir] = useState(rootDir);
  const directoryData = useSelector(selectDirectoryItems(currentDir)) || [];
  const [selectedItems, updateSelected] = useState([]);
  const [chosenCategory, chooseCategory] = useState(rootDir);
  const [createMode, updateCreateMode] = useState(false);
  const [renameMode, updateRenameMode] = useState(false);

  const onGoToDirectory = (id) => updateCurrentDir(id) || updateSelected([]);
  const onSelectItem = (id) => updateSelected([id]);
  const onCancelRename = () => renameMode ? updateRenameMode(false) : updateCreateMode(false);

  // delete selected items
  const onDeleteItem = () => {
    dispatch(unlinkDirectoryItems(currentDir, selectedItems));
    updateSelected([]);
  };
  
  // dispatch to create a new file/folder
  const onCreateItem = (name) => {
    const isDir = createMode === 'dir';
    updateCreateMode(false);
    dispatch(createNewDirectoryItem({ name: name, isDir: isDir, path: currentDir }));
  }

  // dispatch to rename a file/folder
  const onRenameItem = (newName) => {
    updateRenameMode(false);
    dispatch(renameDirectoryItems(selectedItems, newName));
  }

  return (
    <div className='Explorer'>

      <ExplorerRibbon 
        disableAll={currentDir === rootDir}
        currentDir={currentDir}
        selectedItems={selectedItems}
        onCreateItem={(isDir) => updateCreateMode(isDir ? 'dir' : 'file') || updateSelected(['_new'])}
        onRenameItem={() => updateRenameMode(true)}
        onDeleteItem={onDeleteItem}
      />

      <div className='Explorer-viewport'>
        <ExplorerSidebar
          selectedItem={chosenCategory}
          rootDirectoryData={directoryData}
          onGoToDirectory={onGoToDirectory}
          onSelectItem={(id) => chooseCategory(id)}
        />

        <div className='Explorer-fs'>
          <div className={
            currentDir === rootDir ? 'Explorer-rootdirectory' : 'Explorer-directory'
          }>
            <DirectoryView
              items={directoryData}
              selectedItems={selectedItems}
              onDoubleClick={onGoToDirectory}
              onSelectItem={onSelectItem}
              driveIcon={currentDir === rootDir}
              createMode={createMode}
              onCreateItem={onCreateItem}
              onCancelRename={onCancelRename}
              renameMode={renameMode}
              onRenameItem={onRenameItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default Explorer;