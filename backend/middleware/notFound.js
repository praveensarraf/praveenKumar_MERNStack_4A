const notFound = (req, res) => {
    res.status(404).send("<h3>Route doest not exist!<br><a href='/'>See your To-Do list</a></h3>");
}
  
export default notFound;