package rpg.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rpg.backend.model.Prize;
import rpg.backend.service.PrizeService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prizes")
@RequiredArgsConstructor
@CrossOrigin ("*")

public class PrizeController {

    private final PrizeService prizeService;

    @GetMapping
    public List<Prize> getPrizes() {
        return prizeService.getPrizes();
    }

    @PostMapping
    public Prize createPrize(@RequestBody Prize prize) {
        return prizeService.createPrize(prize);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deletePrize(@PathVariable String id) {
        prizeService.deletePrize(id);
        return Map.of("success", true);
    }

    @PostMapping("/{id}/buy")
    public Map<String, Object> buyPrize(
            @PathVariable String id,
            @RequestBody Map<String, Object> request
    ) {
        return prizeService.buyPrize(id, request);
    }
}