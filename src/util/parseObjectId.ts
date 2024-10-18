export function ParseSkillsUtil(skillsString: string) {
  return skillsString.split(",").map((id) => ({ id: parseInt(id) }));
}

export function parsePositionUtil(positionString: string) {
  return { id: parseInt(positionString) };
}
