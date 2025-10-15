maior = []
menor = []
numero = int(input('digite o numero'))
for i in range (numero):
    if numero > maior:
        maior = numero
    if numero < menor:
        menor = numero
print(maior)
print(menor)
