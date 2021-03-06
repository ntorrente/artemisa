package ar.com.frba.utn.tacs.grupocuatro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import ar.com.frba.utn.tacs.grupocuatro.domain.Item_G4;
import ar.com.frba.utn.tacs.grupocuatro.exceptions.ItemAlreadyExistsException;
import ar.com.frba.utn.tacs.grupocuatro.exceptions.ObjectNotFoundException;
import ar.com.frba.utn.tacs.grupocuatro.exceptions.UserAlreadyVoteException;
import ar.com.frba.utn.tacs.grupocuatro.service.ItemService;

@Controller
@RequestMapping("/users/{id_user}/lists/{id_list}/items")
public class ItemController {
	
	@Autowired
	private ItemService itemService;
	
	/**
	 * Devuelve los items de una lista
	 * 
	 * @param id_list
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody ResponseEntity<List<Item_G4>> getItemsFromList(@PathVariable Long id_list){
		return new ResponseEntity<List<Item_G4>>(this.itemService.getItemsFromList(id_list), HttpStatus.OK);
	}
	
	/**
	 * 
	 * @param id_list
	 * @param item
	 * @return Item_G4
	 * @HTTP status 400: cuando no se encuentra el usuario o la lista enviados por parámetro
	 * @HTTP status: 406 Si ya existe un item con el nombre del item enviado 
	 */
	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody ResponseEntity<Item_G4> createItem(@PathVariable Long id_list, @RequestBody Item_G4 item){
		try{
			return new ResponseEntity<Item_G4>(this.itemService.create(id_list, item), HttpStatus.OK);
		}catch(ObjectNotFoundException e){
			return new ResponseEntity<Item_G4>(HttpStatus.NOT_FOUND);
		}catch(ItemAlreadyExistsException e){
			return new ResponseEntity<Item_G4>(HttpStatus.NOT_ACCEPTABLE);
		}
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/{id}/vote")
	public @ResponseBody ResponseEntity<Item_G4> voteItem(@PathVariable Long id){
		try{
			return new ResponseEntity<Item_G4>(this.itemService.voteItem(id),HttpStatus.OK);
		}catch(ObjectNotFoundException e){
			return new ResponseEntity<Item_G4>(HttpStatus.NOT_FOUND);
		}catch(UserAlreadyVoteException e){
			return new ResponseEntity<Item_G4>(HttpStatus.EXPECTATION_FAILED);
		}
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/{id}")
	public @ResponseBody ResponseEntity<Item_G4> deleteList(@PathVariable Long id){
		try{
			this.itemService.delete(id);
			return new ResponseEntity<Item_G4>(HttpStatus.OK);
		}catch(ObjectNotFoundException e){
			return new ResponseEntity<Item_G4>(HttpStatus.NOT_FOUND);
		}
	}

}
