
from src.generator.generator import Generator
import Pyro4

daemon = Pyro4.Daemon()                # make a Pyro daemon
ns = Pyro4.locateNS()                  # find the name server
uri = daemon.register(Generator)   # register the greeting maker as a Pyro object
ns.register("facegenerator.generator", uri)   # register the object with a name in the name server

daemon.requestLoop()            