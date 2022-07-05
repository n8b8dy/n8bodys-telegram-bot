const isCreator = (user_id: string | number) => {
  return Number(user_id) === Number(process.env.CREATOR_ID)
}

export default isCreator
