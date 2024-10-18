export const IsCurrentUserInterviewer = (
  interviewerId: string,
  userId: number
) => {
  const interviewerIds = interviewerId
    .split(",")
    .map((id: string) => parseInt(id, 10));
  return interviewerIds.includes(userId);
};
