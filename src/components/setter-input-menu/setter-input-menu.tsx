import React from 'react';

import Menu, { MenuCollapse, MenuDivider, MenuItem } from 'components/menu';
import Button from 'components/button';
import Toggle from 'components/toggle';
import useModal from 'hooks/use-modal';
import useSelector from 'hooks/use-selector';
import useAction from 'hooks/use-action';
import PlayerSettingsModal from 'components/player-settings-modal';
import SetterInputModeSelect from 'components/setter-input-mode-select';

const SetterInputMenu = () => {
    const debugMode = useSelector((state) => state.ui.debugMode);
    const toggleDebugMode = useAction('ui/toggle-debug-mode');
    const hideSolution = useSelector((state) => state.ui.hideSolution);
    const toggleHideSolution = useAction('ui/toggle-hide-solution');

    const inputMode = useSelector((state) => state.setter.inputMode);
    const setInputMode = useAction('shared/set-setter-input-mode');

    const restrictions = useSelector((state) => state.puzzle.restrictions);
    const setRestrictions = useAction('shared/set-restrictions');

    const _reset = useAction('shared/reset');

    const reset = () => {
        _reset();
        window.location.hash = '';
    };

    const openPlayerSettingsModal = useModal(
        <PlayerSettingsModal onClose={() => openPlayerSettingsModal(false)} />
    );

    return (
        <Menu>
            <MenuItem>
                <Button
                    primary
                    wide
                    href={`/puzzle/${window.location.hash}`}
                    target="blank"
                >
                    <i className="fad fa-play m-r-12" />
                    Test puzzle
                </Button>
            </MenuItem>
            <MenuDivider label="Input mode" />
            <MenuItem>
                <SetterInputModeSelect
                    inputMode={inputMode}
                    onChange={setInputMode}
                />
            </MenuItem>
            <MenuCollapse label="View">
                <MenuItem>
                    <Toggle
                        sw
                        checked={debugMode}
                        onChange={() => toggleDebugMode()}
                    >
                        Debug mode
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Toggle
                        sw
                        checked={hideSolution}
                        onChange={() => toggleHideSolution()}
                    >
                        Hide solution
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Button wide onClick={() => openPlayerSettingsModal(true)}>
                        <i className="fad fa-wrench m-r-12" />
                        Player settings
                    </Button>
                </MenuItem>
            </MenuCollapse>
            <MenuCollapse label="Puzzle settings">
                <MenuItem>
                    <Toggle disabled>Enable perimeter cells</Toggle>
                </MenuItem>
                <MenuItem>
                    <Toggle
                        checked={restrictions.antiKnight}
                        onChange={() =>
                            setRestrictions({
                                antiKnight: !restrictions.antiKnight,
                            })
                        }
                    >
                        Anti-knight
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Toggle
                        checked={restrictions.antiKing}
                        onChange={() =>
                            setRestrictions({
                                antiKing: !restrictions.antiKing,
                            })
                        }
                    >
                        Anti-king
                    </Toggle>
                </MenuItem>
                <MenuItem>
                    <Toggle
                        checked={restrictions.uniqueDiagonals}
                        onChange={() =>
                            setRestrictions({
                                uniqueDiagonals: !restrictions.uniqueDiagonals,
                            })
                        }
                    >
                        Unique diagonals
                    </Toggle>
                </MenuItem>
            </MenuCollapse>
            <MenuDivider label="Puzzle" />
            <MenuItem>
                <Button wide onClick={() => reset()}>
                    <i className="fad fa-times m-r-12" />
                    Reset grid
                </Button>
            </MenuItem>
            <MenuItem>
                <Button wide disabled onClick={() => {}}>
                    <i className="fad fa-save m-r-12" />
                    Save draft
                </Button>
            </MenuItem>
            <MenuItem>
                <Button wide primary disabled onClick={() => {}}>
                    <i className="fad fa-check m-r-12" />
                    Publish
                </Button>
            </MenuItem>
        </Menu>
    );
};

export default SetterInputMenu;
