import { MentionController, SlashCommandController } from '@nonoun/native-ui/traits';
import { logAppend as appendLog } from '../../../scripts/event-log';

document.addEventListener('astro:page-load', () => {
  if (!document.getElementById('mentionable-page')) return;

  const teamMembers = [
    { value: 'kim', label: 'Kim Granlund', description: 'Designer' },
    { value: 'alex', label: 'Alex Chen', description: 'Engineer' },
    { value: 'sam', label: 'Sam Rivera', description: 'Product Manager' },
    { value: 'kai', label: 'Kai Nakamura', description: 'QA Lead' },
    { value: 'jordan', label: 'Jordan Lee', description: 'Engineer' },
    { value: 'taylor', label: 'Taylor Brooks', description: 'DevOps' },
  ];

  // ── Basic Mentions (Textarea) ──

  const basicWrapper = document.getElementById('basic-wrapper')!;
  const basicTextarea = document.getElementById('basic-textarea')!;
  const basicLog = document.getElementById('basic-log');

  new MentionController(basicWrapper, {
    input: basicTextarea,
    items: teamMembers,
  });

  basicWrapper.addEventListener('native:mention-select', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(basicLog, `Mentioned: @${detail.command.label} (${detail.command.value})`);
  });
  basicWrapper.addEventListener('native:mention-query', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(basicLog, `Query: "@${detail.query}" — ${detail.commands.length} match(es)`);
  });

  // ── With n-input ──

  const inputWrapper = document.getElementById('input-wrapper')!;
  const inputField = document.getElementById('input-field')!;
  const inputLog = document.getElementById('input-log');

  new MentionController(inputWrapper, {
    input: inputField,
    items: teamMembers.slice(0, 3),
  });

  inputWrapper.addEventListener('native:mention-select', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(inputLog, `Mentioned: @${detail.command.label}`);
  });

  // ── Combined: Slash + Mention ──

  const comboWrapper = document.getElementById('combo-wrapper')!;
  const comboTextarea = document.getElementById('combo-textarea')!;
  const comboLog = document.getElementById('combo-log');

  new SlashCommandController(comboWrapper, {
    input: comboTextarea,
    commands: [
      { value: 'help', label: 'Help', description: 'Get help' },
      { value: 'clear', label: 'Clear', description: 'Clear conversation' },
      { value: 'summarize', label: 'Summarize', description: 'Summarize thread' },
    ],
  });

  new MentionController(comboWrapper, {
    input: comboTextarea,
    items: teamMembers,
  });

  comboWrapper.addEventListener('native:slash-select', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(comboLog, `Command: /${detail.command.value}`);
  });
  comboWrapper.addEventListener('native:mention-select', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(comboLog, `Mention: @${detail.command.label}`);
  });
  comboWrapper.addEventListener('native:slash-query', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(comboLog, `/ query: "${detail.query}"`);
  });
  comboWrapper.addEventListener('native:mention-query', (e) => {
    const detail = (e as CustomEvent).detail;
    appendLog(comboLog, `@ query: "${detail.query}"`);
  });
});
