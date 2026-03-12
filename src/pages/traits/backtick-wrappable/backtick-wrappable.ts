import { BacktickWrapController, SlashCommandController, MentionController } from '@nonoun/native-ui/traits';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('backtick-wrappable-page')) return;

  // ── Basic Backtick Wrap ──

  const basicWrapper = document.getElementById('basic-wrapper')!;
  const basicTextarea = document.getElementById('basic-textarea')!;
  const basicLog = document.getElementById('basic-log');

  new BacktickWrapController(basicWrapper, {
    input: basicTextarea,
  });

  basicWrapper.addEventListener('native:backtick-wrap', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(basicLog, `Wrapped: "${detail.text}"`);
  });

  // ── Combined: All Text Commands ──

  const comboWrapper = document.getElementById('combo-wrapper')!;
  const comboTextarea = document.getElementById('combo-textarea')!;
  const comboLog = document.getElementById('combo-log');

  new SlashCommandController(comboWrapper, {
    input: comboTextarea,
    commands: [
      { value: 'help', label: 'Help', description: 'Get help' },
      { value: 'clear', label: 'Clear', description: 'Clear conversation' },
    ],
  });

  new MentionController(comboWrapper, {
    input: comboTextarea,
    items: [
      { value: 'kim', label: 'Kim Granlund', description: 'Designer' },
      { value: 'alex', label: 'Alex Chen', description: 'Engineer' },
    ],
  });

  new BacktickWrapController(comboWrapper, {
    input: comboTextarea,
  });

  comboWrapper.addEventListener('native:slash-select', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(comboLog, `Command: /${detail.command.value}`);
  });
  comboWrapper.addEventListener('native:mention-select', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(comboLog, `Mention: @${detail.command.label}`);
  });
  comboWrapper.addEventListener('native:backtick-wrap', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(comboLog, `Code: \`${detail.text}\``);
  });
});
