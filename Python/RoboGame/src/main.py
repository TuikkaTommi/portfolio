import pygame
from random import randint

# Luokka "Olio" vastaa vihollisten ja kolikoiden toiminnoista
class Olio:
    def __init__(self, tyyppi: str, naytto) -> None:
        self.tyyppi = tyyppi
        self.kuva = pygame.image.load(tyyppi + ".png")
        self.alue = self.kuva.get_rect()
        self.alue.x = 925
        self.alue.y = randint(10, 520 - self.kuva.get_height() - 50)
        self.naytto = naytto
        self.alas = False
        self.ylos = False
        self.poistunut = False

        # Vain hirviöt voivat liikkua ylös/alas
        if tyyppi == "hirvio":
            self.valitse_suunta()

    # Metodi, jolla valitaan liikkuuko hirviö suoraan vai ylös/alas
    def valitse_suunta(self):
        suunta = randint(0, 10)
        if suunta == 1:
            self.alas = True
        elif suunta == 2:
            self.ylos = True
            
    # Metodi, jolla olio liikkuu
    def liiku(self):
        if self.alas:
            self.alue.y += 4
            if self.alue.y >= 520 - self.kuva.get_height() - 50:
                self.alas = False
                self.ylos = True

        if self.ylos:
            self.alue.y -= 4
            if self.alue.y <= 0:
                self.alas = True
                self.ylos = False

        self.alue.x -= 4
        self.naytto.blit(self.kuva, self.alue)

    # Metodi, joka piilottaa olion, siirtämällä sen näkyvän alueen ulkopuolelle
    # Kun poistunut on True, ei oliota enää liikuteta
    def katoa(self):
        self.alue.x = -100
        self.alue.y = -100
        self.poistunut = True
        
    # Metodi, joka tarkistaa osuuko olio roboon. Metodi hyödyntää pygamen colliderect-funktiota
    def testaa_osuma(self, robon_alue):
        if self.alue.colliderect(robon_alue):
            # print(self.tyyppi)
            self.katoa()
            # Palautetaan olion tyyppi, jotta pelissä voidaan toimia eri tavoin sen perusteella onko kyseessä kolikko vai hirviö
            return self.tyyppi
        return False

# Luokka "Peli" vastaa itse pelin pyörittämisestä, sekä robon liikkumisesta
class Peli:
    def __init__(self) -> None:
        pygame.init()

        self.korkeus = 520
        self.leveys = 920
        self.naytto = pygame.display.set_mode((self.leveys, self.korkeus))
        self.maan_korkeus = 50

        self.robo = pygame.image.load("robo.png")
        self.robon_alue = self.robo.get_rect()
        self.robon_alue.x = 10
        self.robon_alue.y = self.korkeus - self.robo.get_height()

        self.oikealle = False
        self.vasemmalle = False
        self.ylos = False

        self.pisteet = 0
        self.huipputulos = 0
        self.elamat = 3
        self.oliot = []
        self.pause = False
        self.peli_ohi = False

        self.fontti = pygame.font.SysFont("Arial", 24)
        pygame.display.set_caption("RoboPeli")

        self.kello = pygame.time.Clock()

        self.pelisilmukka()

    # Metodi, joka lisää satunnaisesti uuden olion peliin
    def luodaanko_uusi_olio(self):
        luku = randint(1, 100)
        if luku == 10:
            olio = Olio("kolikko", self.naytto)
            self.oliot.append(olio)
        if luku == 20:
            olio = Olio("hirvio", self.naytto)
            self.oliot.append(olio)

    # Metodi, joka pyörittää itse peliä
    def pelisilmukka(self):
        while True:
            # Kun peli on pausella, seurataan vain tapahtumia ja näytetään teksti
            if self.pause:
                self.tapahtumat()
                teksti = self.fontti.render("Paused", True, (255, 0, 0))
                self.naytto.blit(teksti, (400, 250))
                pygame.display.flip()
            # Kun peli on ohi, peli pysähtyy, ja pelin tulos näytetään
            elif self.peli_ohi:
                self.tapahtumat()
                teksti = self.fontti.render(
                    f"Peli ohi, sait {self.pisteet} pistettä!", True, (255, 0, 0))
                self.naytto.blit(teksti, (350, 250))
                pygame.display.flip()
            # Pelin ajo normaalisti
            else:
                self.tapahtumat()
                self.piirra_naytto()
                if self.vasemmalle or self.oikealle or self.ylos:
                    self.liiku()
                self.painovoima()
                self.luodaanko_uusi_olio()
                self.kello.tick(60)

    # Metodi uuden pelin alustamiselle, resetoi tarvittavat muuttujat
    def uusi_peli(self):
        if self.pisteet > self.huipputulos:
            self.huipputulos = self.pisteet
        self.peli_ohi = False
        self.pause = False
        self.elamat = 3
        self.pisteet = 0
        self.robon_alue.x = 10
        self.robon_alue.y = self.korkeus - self.maan_korkeus - self.robo.get_height()
        self.oliot = []
        

    # Metodi, joka seuraa tapahtumia
    def tapahtumat(self):
        for tapahtuma in pygame.event.get():
            if tapahtuma.type == pygame.KEYDOWN:
                if tapahtuma.key == pygame.K_LEFT:
                    self.vasemmalle = True
                if tapahtuma.key == pygame.K_RIGHT:
                    self.oikealle = True
                if tapahtuma.key == pygame.K_UP:
                    self.ylos = True
                if tapahtuma.key == pygame.K_p:
                    self.pause = not self.pause
                if tapahtuma.key == pygame.K_F2:
                    self.uusi_peli()
                if tapahtuma.key == pygame.K_ESCAPE:
                    exit()

            if tapahtuma.type == pygame.KEYUP:
                if tapahtuma.key == pygame.K_LEFT:
                    self.vasemmalle = False
                if tapahtuma.key == pygame.K_RIGHT:
                    self.oikealle = False
                if tapahtuma.key == pygame.K_UP:
                    self.ylos = False

            if tapahtuma.type == pygame.QUIT:
                exit()

    # Metodi, joka vastaa robon liikkumisesta
    def liiku(self):
        if self.ylos and self.robon_alue.y >= 0:
            self.robon_alue.y -= 4
        if self.vasemmalle and self.robon_alue.x >= 0:
            self.robon_alue.x -= 2
        if self.oikealle and self.robon_alue.x + self.robo.get_width() <= self.leveys:
            self.robon_alue.x += 2

    # Metodi, jonka avulla robo laskeutuu automaagisesti maata kohti
    def painovoima(self):
        if self.robon_alue.y <= self.korkeus - self.robo.get_height() and not self.ylos:
            # Tarkistetaan onko robo jo niin alhaalla että se menisi maan sisään
            if (self.korkeus - self.robo.get_height()) - self.robon_alue.y - self.maan_korkeus < 4:
                self.robon_alue.y = self.korkeus - self.robo.get_height() - self.maan_korkeus
            else:
                self.robon_alue.y += 4
    
    # Metodi, joka liikuttaa kolikoita ja hirviöitä ja testaa osuuko ne roboon
    def liikuta_olioita(self):
        # Tyhjennetään oliolistasta turhat oliot
        for olio in self.oliot:
            if olio.poistunut:
                self.oliot.remove(olio)
        # Liikutetaan olioita ja tarkistetaan osumat        
        for olio in self.oliot:
            olio.liiku()
            osuma = olio.testaa_osuma(self.robon_alue)
            if osuma == "hirvio":
                self.elamat -= 1
                if self.elamat <= 0:
                    self.peli_ohi = True
            elif osuma == "kolikko":
                self.pisteet += 1
    
    # Metodi, joka piirtää tekstit näyttöön
    def piirra_tekstit(self):
        teksti = self.fontti.render("P = Pause", True, (255, 0, 0))
        self.naytto.blit(teksti, (20, 10))
        teksti = self.fontti.render("F2 = Uusi peli", True, (255, 0, 0))
        self.naytto.blit(teksti, (150, 10))
        teksti = self.fontti.render("Esc = Sulje peli", True, (255, 0, 0))
        self.naytto.blit(teksti, (300, 10))
        teksti = self.fontti.render("Kerää kolikoita ja varo hirviöitä!", True, (0, 0, 0))
        self.naytto.blit(teksti, (310, 480))

        teksti = self.fontti.render(
            f"Pisteet: {self.pisteet}", True, (0, 255, 0))
        self.naytto.blit(teksti, (800, 10))

        if self.huipputulos > 0:
            teksti = self.fontti.render(
            f"Ennätys: {self.huipputulos}", True, (0, 255, 0))
            self.naytto.blit(teksti, (500, 10))

        if self.elamat > 1:
          teksti = self.fontti.render(
              f"Elämät: {self.elamat}", True, (0, 255, 0))
        else:
            teksti = self.fontti.render(
              f"Elämät: {self.elamat}", True, (255, 0, 0))
        self.naytto.blit(teksti, (650, 10))

    # Metodi, joka piirtää halutun sisällön ruutuun
    def piirra_naytto(self):
        self.naytto.fill((82, 82, 82))
        pygame.draw.rect(self.naytto, (32, 105, 14),
                         (0, self.korkeus - 50, self.leveys, self.maan_korkeus))

        self.piirra_tekstit()
        self.liikuta_olioita()

        self.naytto.blit(self.robo, (self.robon_alue.x, self.robon_alue.y))
        pygame.display.flip()


if __name__ == "__main__":
    Peli()
