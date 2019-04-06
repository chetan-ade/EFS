''' NAIVE BAYES CLASSIFICATION Algorithm to find the label/quality of a given test value based on previously known values'''
'''
    The input data will be read from a file where data in the form:
        red    , sports , domestic , yes
        red    , sports , domestic , no
    will be converted to a data list:
    [['red', 'sports', 'domestic', 'yes'],
     ['red', 'sports', 'domestic', 'no']].
     All comments will be based to above example.But the program can run on any given data.Just change the filename below..
'''
filename="data2.txt"
data = []
datafile = open(filename, "r")
for line in datafile:
    dataList = list(line.split(','))
    ''' above line will convert 'red    , sports , domestic , yes' to ['red    ', 'sports ', 'domestic ', 'yes\n']'''
    dataList = [i.replace(" ","").replace("\n","").lower() for i in dataList]
    ''' The list still has extra whitespaces and \n in the last parameter. To remove both, we use replace(). 
        To maintain consistency,we convert all text to lowercase'''
    data.append(dataList)
datafile.close()
#closing the file after reading
attributes = data.pop(0)
''' The first line of text file will be attribute names instead of data entry.
    We pop it out of the data list and store them in attributes list and show it to user during input'''
target = int(input("Enter the target attribute number(0-"+str(len(data[0])-1)+"): "))
''' for ['red', 'sports', 'domestic', 'yes'], ['red', 'sports', 'domestic', 'no'] target value is yes or no ie 3.Here len(data[0])=4'''

print("Enter the test case input (",end="")
for i in range(len(attributes)):
    if i != target:
        print(str(attributes[i]),end=",")
'''We print all attributes excluding the target attribute'''
print("): ")
test = input()
''' Because of how the code works, it is not necessary for the user to enter the attributes in the exact order.'''
testCase = list(test.replace(" ","").replace("\n","").lower().split(','))
'''Just like datalist,we bring the data in the form present in data list'''
try:
    testCase.remove('')
except ValueError:
    pass
'''Sometimes the user may put extra comma and it will result to '' getting inserted in the list.Above line removes such entries.If '' is not present,it throws valueerror.
   For that we have used try and except.If user gives proper input,valueError is raised but nothing happens as it is handled.'''
#print("TC: ",testCase)
''' red, suv, domestic will be the input format. It will be converted to list'''
for i in data:
    pass#print(i)
    ''' printing data entries one below the other to increase readability'''
distinct = []
'''distinct list will hold distinct values of each attribute.'''
for i in range(len(data[0])):
    distinct.append([])
    ''' distinct will now have [[],[],[],[]]'''
for i in data:
    for j in range(len(data[0])):
        if i[j] not in distinct[j]:
            distinct[j].append(i[j])
#print(distinct)
''' Distinct will look like: [['red', 'yellow'], ['sports', 'suv'], ['domestic', 'imported'], ['yes', 'no']]  
    This list will be useful for traversing later on.'''

dict = {}
'''dict to hold the attributes and their probabilities'''
for i in distinct[target]:
    ''' distinct[target] means distinct[3]. That is ['yes','no']. So i will loop twice first taking value yes then no'''
    count = 0
    for j in range(len(data)):
        ''' Len(data) = 10 as we have 10 data entries.j will traverse through each of them.'''
        if data[j][target] == i:
            ''' Comparing target attribute of each data entry with i(yes/no)'''
            count = count + 1
    dict[i] = count/len(data)
''' above loop will find prob of yes and no and save it as {'no':0.5,'yes':0.5}'''
''' Below is the most important loop of the entire program.
    i will take value (yes,no)
    j will traverse through distinct attributes lists (['red','yellow'],['suv','sports'],['domestic','imported'])
    j==target is set to pass as we dont want to find probs of 'yes with yes' or 'no with yes' as it will make no sense.
    k will then traverse through j. SO together j and k will get each and every attribute. Printing values of k will result in
    red,yellow,suv,sports,domestic,imported
    l will love through data entries of data.
    for the very very first loop of all loops,
    we have i = yes, j = ['red','yellow'], k = red , l = 0-9
    so here we compare if the lth data entry has red as its attribute and also yes as its target attribute.
    if true,we inc count.
    FInally we calc prob by count/(dict[i]*len(data))
    for yes and red,count = 3,dict[yes]*len(data)= 0.5*10= 5
    prob = 3/5 = 0.6
    dict[k+i] will be dict['redyes'] as python will concatinate the strings
    This will be then looped for all possible combinations
'''
for i in distinct[target]:
    for j in range(len(distinct)):
        if j==target:
            pass
        else:
            for k in distinct[j]:
                count = 0
                for l in range(len(data)):
                    if k == data[l][j] and i == data[l][target]:
                        count = count + 1
                dict[k+i] = (count/(dict[i]*len(data)))
#print(dict)

finalprob = {}
#dict to hold the target values and their respective probs
for i in distinct[target]:
    ''' i will hold yes/no'''
    prob = dict[i]
    ''' probability is initialized to dict[i] ie prob(yes)/prob(no)'''
    for j in testCase:
        prob = prob * dict[j+i]
    ''' we then just multiply probability of each attribute entered .To find the prob from dict,we concatinate value of attribute with yes/no.'''
    finalprob[i] = prob
    ''' finally we save all probs in finalprob'''
#print(finalprob)
finalprob = sorted(finalprob)   
#sorting to get target value with max prob first
print("Target value is: ",finalprob[0]) 
#finalprob[0] will have the target with max prob

''' Adding the test case data and the new found target value in the data file'''
datafile = open(filename, "a")
''' USE a(append) instead of w(write) or else all previous data will be overwritten'''
testCase.append(finalprob[0])
testString = ' , '.join(i for i in testCase)
''' testString will contain the string with all attributes in proper form and order to be written to the data file.'''
#print(testString)
datafile.write("\n"+testString)
datafile.close()
#closing the file after writing