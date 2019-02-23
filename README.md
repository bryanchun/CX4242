# CX4242

Homework for the course Data and Visual Analytics of Georgia Institute of Technology, Spring 2019

### Homework Problems

- Q1: https://docs.google.com/document/d/e/2PACX-1vSJ6OBUdqoOBlRDOn02C6O2uZ-0jJf2OW-PdVuddJ0_joKtD6ZzoHVzk1B5ZloYBMtbWnZ-g7_rYaEb/pub
- Q2: https://docs.google.com/document/d/e/2PACX-1vQxxsSJZIp32sVWcQ-W-KhM52fHMhbUBY2lHp4TFpMPw6Wo1LUY2D2aFYWbX5ahAzstxxj7N3zxCXjL/pub

### Project Structure

`HW#-dev/`: comprehensive code including generated files during development

`HW#-submitted/`: requirement-conforming code for submission

- Generated by running, with a new-line-separated list of excluded files `ignore.txt`

  ```rsync -avz --exclude-from 'HW#-dev/ignore' HW#-dev/ HW#-submitted/```


Generate `HW#-{gtid}.zip` by running

  ```zip -r HW#-{gtid}.zip HW#-submitted/```

  ```zip -r HW1-hchun31.zip HW1-submitted/``` for example.