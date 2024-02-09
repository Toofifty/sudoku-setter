import { useRef } from 'react';
import cx from 'classnames';

import useSelector from 'hooks/use-selector';
import './interaction-layer.scss';
import { range } from 'utils';
import { InteractionData, Subcell } from 'reducers/interaction-handlers/types';
import useAction from 'hooks/use-action';

const subcells: Subcell[] = [
    'top-left',
    'top',
    'top-right',
    'left',
    'centre',
    'right',
    'bottom-left',
    'bottom',
    'bottom-right',
];

interface InteractionCellProps {
    index: number;
    onInteractStart: (interaction: InteractionData) => void;
    onInteractMove: (interaction: InteractionData) => void;
    onInteractEnd: (interaction: InteractionData) => void;
}

const InteractionCell = ({
    index,
    onInteractStart,
    onInteractMove,
    onInteractEnd,
}: InteractionCellProps) => {
    return (
        <div
            className={cx('interaction-cell', `interaction-cell--${index}`)}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }}
        >
            {subcells.map((subcell) => (
                <div
                    key={subcell}
                    className={`interaction-cell__${subcell}`}
                    onPointerUp={(e) =>
                        onInteractEnd({
                            index,
                            subcell,
                            button: e.button,
                            buttons: e.buttons,
                            shiftKey: e.shiftKey,
                        })
                    }
                    onPointerDown={(e) =>
                        onInteractStart({
                            index,
                            subcell,
                            button: e.button,
                            buttons: e.buttons,
                            shiftKey: e.shiftKey,
                        })
                    }
                    onPointerMove={(e) => {
                        onInteractMove({
                            index,
                            subcell,
                            button: e.button,
                            buttons: e.buttons,
                            shiftKey: e.shiftKey,
                        });
                        (e.target as any).releasePointerCapture(e.pointerId);
                    }}
                />
            ))}
        </div>
    );
};

const InteractionLayer = () => {
    const previousMove = useRef<InteractionData>();

    const debugMode = useSelector((state) => state.ui.debugMode);
    const interactStart = useAction('shared/interact-start');
    const interactMove = useAction('shared/interact-move');
    const interactEnd = useAction('shared/interact-end');
    const interactLeave = useAction('shared/interact-leave');

    const onInteractStart = (interaction: InteractionData) => {
        interactStart(interaction);
    };

    const onInteractMove = (interaction: InteractionData) => {
        if (previousMove.current) {
            const p = previousMove.current;
            if (
                p.index === interaction.index &&
                p.subcell === interaction.subcell &&
                p.buttons === interaction.buttons &&
                p.shiftKey === interaction.shiftKey
            ) {
                return;
            }
        }
        previousMove.current = interaction;

        interactMove(interaction);
    };

    const onInteractEnd = (interaction: InteractionData) => {
        interactEnd(interaction);
    };

    return (
        <div
            className={cx(
                'interaction-layer',
                debugMode && 'interaction-layer--visible'
            )}
            onPointerLeave={() => interactLeave()}
        >
            {range(0, 81).map((index) => (
                <InteractionCell
                    key={index}
                    index={index}
                    onInteractStart={onInteractStart}
                    onInteractMove={onInteractMove}
                    onInteractEnd={onInteractEnd}
                />
            ))}
        </div>
    );
};

export default InteractionLayer;
